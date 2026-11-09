import React from 'react';
import {List, ListItem, ListHeader} from 'react-onsenui';
import moment from 'moment';
import RoundSlider from '../utils/RoundSlider';
import ScrollWheel from '../utils/ScrollWheel';
import {stringToBoolean} from '../utils/Utils';

moment.locale ('de-DE');

// 1 grid-row of the donut = 57px (square widget)
const DONUT_ROW_HEIGHT = 57;

/**
 * boolean value of a helper-state (stateIdDisabled / stateIdInvisible)
 * returns null if state is not configured or not yet received
 */
function readFlagState (widgetData, stateIdKey) {
  const stateId = widgetData[stateIdKey];
  if (!stateId || stateId === 'undefined') {
    return null;
  }
  const state = widgetData.states[stateId];
  if (!state || state.received !== true) {
    return null;
  }
  return stringToBoolean (state.val);
}

/**
 * Donut
 * round slider (or read-only gauge) for a numeric state.
 * showAsScrollWheel === true => vertical scroll-wheel instead of round slider
 */
export default function Donut({widgetData, setShowModal}) {
  // disabled when not connected or by disabled-state
  const disabled =
    !widgetData.connected || readFlagState (widgetData, 'stateIdDisabled') === true;
  // hidden by invisible-state
  const visible = readFlagState (widgetData, 'stateIdInvisible') !== true;

  const asScrollWheel = widgetData.showAsScrollWheel === true;

  const gotoTarget = () => {
    if (widgetData.isLink !== true || !widgetData.targetpage) {
      return;
    }
    // scroll-wheel: click is used for input, link only when readOnly
    if (asScrollWheel && widgetData.readOnly !== true) {
      return;
    }
    const targetpage = widgetData.targetpage;
    if (targetpage.startsWith ('ref@')) {
      setShowModal (targetpage);
    } else if (widgetData.pageLinks && widgetData.pageLinks[targetpage]) {
      widgetData.pageLinks[targetpage] ();
    } else {
      console.warn ('Donut: targetpage not found: ' + targetpage);
    }
  };

  let timestamp = null;
  if (widgetData.timestamp === true) {
    const state = widgetData.states[widgetData.stateId];
    const ts = state && state.received === true ? state.ts : null;
    timestamp = (
      <ListHeader>
        <span className="right lastupdate" style={{float: 'right', paddingRight: '5px'}}>
          {ts ? moment (ts).format ('DD.MM.YY HH.mm') : ''}
        </span>
      </ListHeader>
    );
  }

  // ---------- scroll-wheel ----------
  if (asScrollWheel) {
    return (
      <div
        id={widgetData.UUID}
        className="donutWidget scrollWheelWidget"
        style={{
          display: visible ? 'flex' : 'none',
          flexDirection: 'column',
          height: '100%',
        }}
        onClick={gotoTarget}
      >
        {timestamp}
        <div style={{display: 'flex', flex: 1, minHeight: 0}}>
          <ScrollWheel settings={widgetData} disabled={disabled} />
        </div>
      </div>
    );
  }

  // ---------- round slider ----------
  const size = widgetData.widgetHeight * DONUT_ROW_HEIGHT;
  const parentId = 'rs-' + widgetData.UUID;

  return (
    <List
      id={widgetData.UUID}
      class="donutWidget"
      style={{display: visible ? 'block' : 'none'}}
    >
      {timestamp}
      <ListItem onClick={gotoTarget}>
        <div
          id={parentId}
          style={{width: size + 'px', height: size + 'px', margin: 'auto'}}
        >
          <RoundSlider disabled={disabled} parentId={parentId} settings={widgetData} />
        </div>
      </ListItem>
    </List>
  );
}
