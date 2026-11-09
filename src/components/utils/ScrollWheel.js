import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import './scrollwheel.css';
import {countDecimals, fixOutputFloat} from './Utils';

// height of one value-row in px
const ITEM_HEIGHT = 40;
// font-size of values in px, value in center is scaled by CENTER_SCALE
const FONT_SIZE = 22;
const CENTER_SCALE = 1.25;
// smallest font-factor when widget is narrow
const MIN_FIT = 0.4;
// max number of rows rendered (protects against min/max/step mistakes)
const MAX_ITEMS = 5000;
// ms without scroll-event => wheel has stopped
const SCROLL_END_DELAY = 150;

/**
 * ScrollWheel
 * vertical drum picker (like iOS picker) for setpoints, e.g. temperature.
 * Uses native scrolling + css scroll-snap => momentum on touch, mouse-wheel on desktop.
 *
 * props:
 *   settings  widgetData (min, max, step, decimals, unit, icon, iconFamily,
 *             stateId, stateIdType, states, socket, readOnly, updateOnComplete)
 *   disabled  no input possible (not connected / disabled-state)
 */
export default function ScrollWheel({settings, disabled}) {
  const scrollerRef = useRef (null);
  const bandContentRef = useRef (null);
  const itemRefs = useRef ([]);
  const rafRef = useRef (null);
  const scrollEndTimer = useRef (null);
  const userScrolling = useRef (false);
  const programmatic = useRef (false);
  const lastSentIndex = useRef (null);
  const currentIndex = useRef (0);

  const [viewHeight, setViewHeight] = useState (0);
  const [viewWidth, setViewWidth] = useState (0);
  // font-factor so that [icon][value][unit] fits into the widget width
  const [fit, setFit] = useState (1);
  const [activeIndex, setActiveIndex] = useState (0);

  const readOnly = settings.readOnly === true;
  const locked = disabled || readOnly;

  // ---------- config ----------
  let min = parseFloat (settings.min);
  let max = parseFloat (settings.max);
  let step = Math.abs (parseFloat (settings.step));
  if (isNaN (min)) min = 0;
  if (isNaN (max)) max = 100;
  if (max < min) [min, max] = [max, min];
  if (!step || isNaN (step)) step = 1;

  let decimals = parseInt (settings.decimals, 10);
  if (isNaN (decimals) || decimals < 0) decimals = 0;
  if (decimals > 5) decimals = 5;

  const unit = settings.unit || '';
  const roundDecimals = Math.max (countDecimals (step), countDecimals (min), decimals);

  const values = useMemo (
    () => {
      const list = [];
      const count = Math.min (Math.floor ((max - min) / step + 1e-9) + 1, MAX_ITEMS);
      for (let i = 0; i < count; i++) {
        list.push (parseFloat ((min + i * step).toFixed (roundDecimals)));
      }
      return list;
    },
    [min, max, step, roundDecimals]
  );

  const widestLabel = useMemo (
    () =>
      values.reduce ((widest, v) => {
        const label = fixOutputFloat (v, decimals);
        return label.length > widest.length ? label : widest;
      }, ''),
    [values, decimals]
  );

  const valueToIndex = useCallback (
    val => {
      const v = parseFloat (val);
      if (isNaN (v)) return 0;
      const idx = Math.round ((v - min) / step);
      return Math.max (0, Math.min (values.length - 1, idx));
    },
    [min, step, values.length]
  );

  // ---------- value from ioBroker ----------
  const stateObj = settings.states[settings.stateId];
  const remoteIndex = stateObj && stateObj.received === true
    ? valueToIndex (stateObj.val)
    : null;

  const padding = Math.max (0, (viewHeight - ITEM_HEIGHT) / 2);

  // ---------- drum-effect (direct DOM, no re-render per frame) ----------
  const updateVisuals = useCallback (
    () => {
      rafRef.current = null;
      const el = scrollerRef.current;
      if (!el || !viewHeight) return;
      const center = el.scrollTop + viewHeight / 2;
      const half = viewHeight / 2;
      const first = Math.max (0, Math.floor ((el.scrollTop - padding) / ITEM_HEIGHT) - 1);
      const last = Math.min (
        values.length - 1,
        Math.ceil ((el.scrollTop + viewHeight - padding) / ITEM_HEIGHT) + 1
      );
      for (let i = first; i <= last; i++) {
        const item = itemRefs.current[i];
        if (!item) continue;
        const itemCenter = padding + i * ITEM_HEIGHT + ITEM_HEIGHT / 2;
        const rel = Math.max (-1, Math.min (1, (itemCenter - center) / half));
        const scale = CENTER_SCALE - Math.abs (rel) * 0.4;
        item.style.transform = `rotateX(${-rel * 65}deg) scale(${scale})`;
        item.style.opacity = String (1 - Math.abs (rel) * 0.75);
      }
    },
    [viewHeight, padding, values.length]
  );

  // raf always calls the LATEST updateVisuals (a frame queued before the
  // wheel was measured must not run with stale viewHeight/padding)
  const visualsRef = useRef (updateVisuals);
  visualsRef.current = updateVisuals;
  const requestVisuals = useCallback (() => {
    if (rafRef.current == null) {
      rafRef.current = window.requestAnimationFrame (() => visualsRef.current ());
    }
  }, []);

  // ---------- send value ----------
  const sendIndex = idx => {
    if (idx === lastSentIndex.current) return;
    lastSentIndex.current = idx;
    let valueToSend = values[idx];
    if (settings.stateIdType === 'string') {
      valueToSend = fixOutputFloat (valueToSend, decimals);
    }
    settings.socket.emit ('setState', settings.stateId, valueToSend);
    console.debug ('ScrollWheel ' + settings.stateId + ' :: ' + valueToSend);
  };

  const scrollToIndex = useCallback ((idx, smooth) => {
    const el = scrollerRef.current;
    if (!el) return;
    const target = idx * ITEM_HEIGHT;
    if (Math.abs (el.scrollTop - target) < 1) return;
    programmatic.current = true;
    if (smooth && el.scrollTo) {
      el.scrollTo ({top: target, behavior: 'smooth'});
    } else {
      el.scrollTop = target;
    }
  }, []);

  // ---------- scroll handling ----------
  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    requestVisuals ();

    const idx = Math.max (0, Math.min (values.length - 1, Math.round (el.scrollTop / ITEM_HEIGHT)));
    if (idx !== currentIndex.current) {
      currentIndex.current = idx;
      setActiveIndex (idx);
      if (!programmatic.current && settings.updateOnComplete === false) {
        sendIndex (idx);
      }
    }
    if (!programmatic.current) {
      userScrolling.current = true;
    }

    clearTimeout (scrollEndTimer.current);
    scrollEndTimer.current = setTimeout (() => {
      const wasUser = userScrolling.current && !programmatic.current;
      userScrolling.current = false;
      programmatic.current = false;
      if (wasUser) {
        sendIndex (currentIndex.current);
      }
    }, SCROLL_END_DELAY);
  };

  // user grabs the wheel while it is animating => his scroll counts, not ours
  const onUserInput = () => {
    programmatic.current = false;
  };

  const onItemClick = idx => {
    if (locked || idx === currentIndex.current) return;
    programmatic.current = false;
    userScrolling.current = true;
    const el = scrollerRef.current;
    if (el && el.scrollTo) {
      el.scrollTo ({top: idx * ITEM_HEIGHT, behavior: 'smooth'});
    }
  };

  // measure size of wheel
  useLayoutEffect (() => {
    const el = scrollerRef.current;
    if (!el) return;
    const measure = () => {
      setViewHeight (el.clientHeight);
      setViewWidth (el.clientWidth);
    };
    measure ();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver (measure);
    ro.observe (el);
    return () => ro.disconnect ();
  }, []);

  // shrink font when widget is too narrow (all sizes are em => width is proportional to font-size)
  useLayoutEffect (
    () => {
      const content = bandContentRef.current;
      if (!content || !viewWidth) return;
      const natural = content.offsetWidth / fit;
      if (!natural) return;
      const newFit = Math.max (MIN_FIT, Math.min (1, (viewWidth - 8) / natural));
      if (Math.abs (newFit - fit) > 0.01) setFit (newFit);
    },
    [viewWidth, fit, widestLabel, unit, settings.icon, settings.iconFamily]
  );

  // follow value from ioBroker (not while user is scrolling)
  useLayoutEffect (
    () => {
      if (!viewHeight || userScrolling.current) return;
      const idx = remoteIndex != null ? remoteIndex : currentIndex.current;
      lastSentIndex.current = idx;
      currentIndex.current = idx;
      setActiveIndex (idx);
      // first positioning without animation
      const el = scrollerRef.current;
      const smooth = el && el.dataset.positioned === 'true';
      scrollToIndex (idx, smooth);
      if (el) el.dataset.positioned = 'true';
      requestVisuals ();
    },
    [remoteIndex, viewHeight, scrollToIndex, requestVisuals]
  );

  useEffect (() => requestVisuals (), [requestVisuals, fit]);

  useEffect (
    () => () => {
      clearTimeout (scrollEndTimer.current);
      if (rafRef.current != null) window.cancelAnimationFrame (rafRef.current);
    },
    []
  );

  // ---------- render ----------
  const showIcon = !!settings.iconFamily && settings.iconFamily !== 'noIcon';
  const showUnit = unit !== '';

  // items and center-band have identical layout [icon][value][unit]:
  // items show only the value, band shows only icon + unit
  // => value stays centered between them
  const iconSlot = visible =>
    showIcon &&
    <span
      className={
        visible
          ? 'scrollWheelIcon sliderIcon ' + settings.iconFamily + ' ' + (settings.icon || '')
          : 'scrollWheelIcon'
      }
      style={{visibility: visible ? 'visible' : 'hidden'}}
    />;
  const unitSlot = visible =>
    showUnit &&
    <span className="scrollWheelUnit" style={{visibility: visible ? 'visible' : 'hidden'}}>
      {unit}
    </span>;

  return (
    <div
      className={
        'scrollWheelWrap' + (disabled ? ' disabled' : '') + (readOnly ? ' readOnly' : '')
      }
    >
      <div
        ref={scrollerRef}
        className="scrollWheelScroller"
        onScroll={onScroll}
        onTouchStart={onUserInput}
        onWheel={onUserInput}
        onMouseDown={onUserInput}
        role="listbox"
        aria-label={settings.stateId}
        aria-disabled={locked}
      >
        <div style={{height: padding + 'px'}} />
        {values.map ((val, i) => (
          <div
            key={i}
            ref={el => (itemRefs.current[i] = el)}
            className={'scrollWheelItem' + (i === activeIndex ? ' active' : '')}
            style={{height: ITEM_HEIGHT + 'px', fontSize: FONT_SIZE * fit + 'px'}}
            role="option"
            aria-selected={i === activeIndex}
            onClick={() => onItemClick (i)}
          >
            {iconSlot (false)}
            <span>{fixOutputFloat (val, decimals)}</span>
            {unitSlot (false)}
          </div>
        ))}
        <div style={{height: padding + 'px'}} />
      </div>
      <div
        className="scrollWheelBand"
        style={{height: ITEM_HEIGHT + 'px', fontSize: FONT_SIZE * CENTER_SCALE * fit + 'px'}}
      >
        <span ref={bandContentRef} className="scrollWheelBandContent">
          {iconSlot (true)}
          {/* placeholder with the widest value => icon/unit don't jump */}
          <span style={{visibility: 'hidden'}}>{widestLabel}</span>
          {unitSlot (true)}
        </span>
      </div>
    </div>
  );
}
