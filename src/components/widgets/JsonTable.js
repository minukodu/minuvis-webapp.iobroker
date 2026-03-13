import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { List, ListItem, ListHeader } from "react-onsenui";
import moment from "moment";
moment.locale("de-DE");

/**
 * Percent Table:
 * - Table width: 100%
 * - Column widths are % based on colSizes (sum=100). If not, normalize.
 * - Excel-like resize:
 *   Drag between col i and i+1 => left += delta%, right -= delta% (min col width honored).
 */
export default function JsonTable({
  widgetData,
  linkifyUrls = true,
  imageMaxHeight = 80,
  minColWidth = 40,       // min width in px (converted to % depending on container width)
}) {
  const emptyMessage = "Keine Daten vorhanden";
  const pageSizeOptions = [10, 25, 50, 100];
  const ts = moment();

  /* ---------------- Helpers ---------------- */
  const isImageUrl = (v) => {
    if (!v) return false;
    const s = String(v).trim();
    if (/^data:image\//i.test(s)) return true;
    return /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?(#.*)?$/i.test(s);
  };
  const isHttpUrl = (v) => {
    if (!v) return false;
    return /^https?:\/\/\S+$/i.test(String(v).trim());
  };
  const looksLikeHtml = (v) => {
    if (!v) return false;
    return /<[^>]+>/.test(String(v));
  };
  const clamp = (val, min, max) => {
    let v = val;
    if (typeof min === "number") v = Math.max(min, v);
    if (typeof max === "number") v = Math.min(max, v);
    return v;
  };

  // Normalize an array of numbers to sum = 100, keep last column as remainder to avoid floating drift
  const normalizeTo100 = (arr, fallbackCount) => {
    const n = Math.max(0, fallbackCount ?? arr?.length ?? 0);
    const raw = Array.from({ length: n }, (_, i) => {
      const v = Number(arr?.[i]);
      return Number.isFinite(v) ? v : 0;
    });

    const sum = raw.reduce((a, b) => a + b, 0);
    if (n === 0) return [];
    if (!(sum > 0)) {
      // fallback: equal share
      const eq = 100 / n;
      const out = raw.map(() => eq);
      // remainder fix
      const prev = out.slice(0, n - 1).reduce((a, b) => a + b, 0);
      out[n - 1] = 100 - prev;
      return out;
    }

    const scaled = raw.map((v) => (v / sum) * 100);
    // remainder fix
    const out = scaled.map((v) => v);
    const prev = out.slice(0, n - 1).reduce((a, b) => a + b, 0);
    out[n - 1] = 100 - prev;
    return out;
  };

  /* ---------------- Data ---------------- */
  const rawVal =
    widgetData?.states?.[widgetData?.stateId]?.received === true
      ? widgetData.states[widgetData.stateId].val
      : "[{}]";
  const rawValTS =
    widgetData?.states?.[widgetData?.stateId]?.received === true
      ? widgetData.states[widgetData.stateId].ts
      : ts;

  let timestamp = null;
  if (widgetData?.timestamp === true) {
    timestamp = (
      <ListHeader>
        <span
          className="right lastupdate"
          style={{ float: "right", paddingRight: "5px" }}
        >
          {moment(rawValTS).format("DD.MM.YY HH:mm")}
        </span>
      </ListHeader>
    );
  }

  const data = useMemo(() => {
    try {
      const v = rawVal && rawVal.length >= 5 ? rawVal : "[{}]";
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [rawVal]);

  const colHeaders = useMemo(() => {
    const s = widgetData?.colheader || "";
    return s.split(",").map((x) => x.trim()).filter(Boolean);
  }, [widgetData?.colheader]);

  const colSizes = useMemo(() => {
    const s = widgetData?.colsize || "";
    return s.split(",").map((x) => x.trim());
  }, [widgetData?.colsize]);

  const columns = useMemo(() => {
    return colHeaders.map((header, i) => ({
      key: `col_${i}`,
      header: header || `Spalte ${i + 1}`,
    }));
  }, [colHeaders]);

  /* ---------------- Pagination (safe defaults) ---------------- */
  const requestedPageSize = Number(widgetData?.rowsPerPage);
  const safeInitialPageSize = requestedPageSize || 10;

  const [pageSize, setPageSize] = useState(safeInitialPageSize);
  const [pageIndex, setPageIndex] = useState(0);

  const totalRows = Array.isArray(data) ? data.length : 0;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));

  useEffect(() => {
    setPageIndex((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  const pagedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, pageIndex, pageSize]);

  const hasData = totalRows > 0;
  const fromRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const toRow = totalRows === 0 ? 0 : Math.min(totalRows, (pageIndex + 1) * pageSize);

  /* ---------------- Container width (for minColWidth px -> %) ---------------- */
  const scrollRef = useRef(null);
  const [containerWidthPx, setContainerWidthPx] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => setContainerWidthPx(el.clientWidth || 0);
    update();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => update());
      ro.observe(el);
    } else {
      window.addEventListener("resize", update);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", update);
    };
  }, []);

  const minColPercent = useMemo(() => {
    if (!containerWidthPx) return 1; // fallback
    return (minColWidth / containerWidthPx) * 100;
  }, [minColWidth, containerWidthPx]);

  /* ---------------- Initial percent widths from colSizes ----------------
     - Values are normalized to sum=100 (even if user passes pixels or any units).
     - Supports:
       - Array: [10, 20, 70]
       - Object: { col_0: 10, col_1: 20, col_2: 70 }
  ---------------- */
  const initialPercents = useMemo(() => {
    const n = columns.length;

    // Build raw array
    let raw = [];
    if (Array.isArray(colSizes)) {
      raw = colSizes.map((v) => Number(v));
    } else if (colSizes && typeof colSizes === "object") {
      raw = Array.from({ length: n }, (_, i) => Number(colSizes[`col_${i}`]));
    } else {
      // fallback: equal
      raw = Array.from({ length: n }, () => 1);
    }

    const normalized = normalizeTo100(raw, n);

    // enforce minimum percent (derived from minColWidth px)
    // while keeping sum=100 by taking remainder from last column
    if (n > 0 && Number.isFinite(minColPercent) && minColPercent > 0) {
      const out = [...normalized];
      for (let i = 0; i < n; i++) {
        out[i] = Math.max(minColPercent, out[i]);
      }
      // renormalize again to 100 after min constraints
      return normalizeTo100(out, n);
    }

    return normalized;
  }, [colSizes, columns.length, minColPercent]);

  /* ---------------- Column width state in percent ---------------- */
  const [colPercents, setColPercents] = useState(() => {
    // init once on mount; we’ll sync in effect
    return {};
  });

  // Sync state whenever columns or initialPercents change
  useEffect(() => {
    setColPercents((prev) => {
      const next = { ...prev };
      columns.forEach((c, i) => {
        if (!Number.isFinite(next[c.key])) {
          next[c.key] = initialPercents[i] ?? (100 / Math.max(1, columns.length));
        }
      });
      // ensure sum=100 & min%
      const arr = columns.map((c) => Number(next[c.key]) || 0);
      const norm = normalizeTo100(arr, columns.length);
      columns.forEach((c, i) => (next[c.key] = norm[i]));
      return next;
    });
  }, [columns, initialPercents]);

  /* ---------------- Excel-like resizing in percent ---------------- */
  const headerRefs = useRef({});
  const resizeSession = useRef(null);
  const rafId = useRef(null);

  const cleanupUX = () => {
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  const onPointerDownResize = useCallback(
    (e, colIndex) => {
      if (colIndex >= columns.length - 1) return;
      if (e.button != null && e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      const leftKey = columns[colIndex].key;
      const rightKey = columns[colIndex + 1].key;

      // current % values
      const pLeft = Number(colPercents[leftKey]);
      const pRight = Number(colPercents[rightKey]);

      // If missing, fall back to computed from headers (rare)
      const leftTh = headerRefs.current[leftKey];
      const rightTh = headerRefs.current[rightKey];

      let startLeft = Number.isFinite(pLeft) ? pLeft : null;
      let startRight = Number.isFinite(pRight) ? pRight : null;

      if ((!Number.isFinite(startLeft) || !Number.isFinite(startRight)) && containerWidthPx > 0) {
        const wL = leftTh?.getBoundingClientRect?.().width ?? leftTh?.offsetWidth ?? 0;
        const wR = rightTh?.getBoundingClientRect?.().width ?? rightTh?.offsetWidth ?? 0;
        const sumW = wL + wR;
        if (sumW > 0) {
          const pairPct = (sumW / containerWidthPx) * 100;
          startLeft = (wL / sumW) * pairPct;
          startRight = pairPct - startLeft;
        } else {
          startLeft = 50;
          startRight = 50;
        }
      }

      // Scale correction if transforms are used
      const rectW = leftTh?.getBoundingClientRect?.().width;
      const offW = leftTh?.offsetWidth || rectW || 1;
      const scaleX = (typeof rectW === "number" && offW > 0) ? rectW / offW : 1;

      e.currentTarget.setPointerCapture?.(e.pointerId);

      resizeSession.current = {
        startX: e.clientX,
        scaleX: scaleX || 1,
        leftKey,
        rightKey,
        startLeft,
        startRight,
        pairTotal: startLeft + startRight,
        minPct: Math.max(0.1, minColPercent || 0.1),
        containerWidthPx: containerWidthPx || 1,
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [columns, colPercents, minColPercent, containerWidthPx]
  );

  const onPointerMove = useCallback((e) => {
    const s = resizeSession.current;
    if (!s) return;

    // delta in px -> percent
    const deltaVisualPx = e.clientX - s.startX;
    const deltaPx = deltaVisualPx / (s.scaleX || 1);
    const deltaPct = (deltaPx / (s.containerWidthPx || 1)) * 100;

    const maxLeft = s.pairTotal - s.minPct;
    const nextLeft = clamp(s.startLeft + deltaPct, s.minPct, maxLeft);
    const nextRight = s.pairTotal - nextLeft;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      setColPercents((prev) => {
        const next = { ...prev, [s.leftKey]: nextLeft, [s.rightKey]: nextRight };

        // Ensure global sum=100 (avoid float drift by normalizing all cols)
        // and re-apply minPct constraint softly:
        const keys = columns.map((c) => c.key);
        const arr = keys.map((k) => Number(next[k]) || 0);

        // First enforce minimum
        const enforced = arr.map((p) => Math.max(s.minPct, p));
        const norm = normalizeTo100(enforced, enforced.length);

        keys.forEach((k, i) => (next[k] = norm[i]));
        return next;
      });
    });
  }, [columns]);

  const onPointerUp = useCallback(() => {
    if (!resizeSession.current) return;
    resizeSession.current = null;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = null;
    cleanupUX();
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  /* ---------------- Cell Renderer ---------------- */
  const renderCell = (raw) => {
    if (raw == null) return null;
    const str = String(raw).trim();
    if (!str) return null;

    if (isImageUrl(str)) {
      return (
        <img
          src={str}
          alt=""
          style={{
            width: "100%",
            height: "auto",
            maxHeight: `${imageMaxHeight}px`,
            display: "block",
            objectFit: "contain",
          }}
          onError={(e) => {
            const t = document.createTextNode(str);
            e.currentTarget.replaceWith(t);
          }}
        />
      );
    }

    if (looksLikeHtml(str)) {
      return <span dangerouslySetInnerHTML={{ __html: str }} />;
    }

    if (linkifyUrls && isHttpUrl(str)) {
      return (
        <a href={str} target="_blank" rel="noreferrer">
          {str}
        </a>
      );
    }

    return str;
  };

  /* ---------------- colgroup in percent ---------------- */
  const colGroup = useMemo(() => {
    const n = columns.length;
    if (n === 0) return [];
    const raw = columns.map((c, i) => Number(colPercents[c.key]));
    const norm = normalizeTo100(raw, n);
    return columns.map((c, i) => ({
      key: c.key,
      widthPct: norm[i],
    }));
  }, [columns, colPercents]);

  /* ---------------- Table style ----------------
     table-layout: fixed + explicit width makes column widths deterministic. [1](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/table-layout)
  ---------------- */
  const tableStyle = useMemo(() => {
    return {
      width: "100%",
      tableLayout: "fixed",
    };
  }, []);

  return (
    <List id={widgetData.UUID}>
      {timestamp}
    <ListItem>
      <div className="json-table__wrap">
          <div className="json-table__scroll" ref={scrollRef}>
            <table className="json-table" style={tableStyle}>
              <colgroup>
                {colGroup.map((c) => (
                  <col key={c.key} style={{ width: `${c.widthPct}%` }} />
                ))}
              </colgroup>

              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={col.key}
                      ref={(el) => (headerRefs.current[col.key] = el)}
                      className="json-table__th"
                    >
                      <div className="json-table__thContent">
                        <span className="json-table__thLabel">{col.header}</span>

                        {idx < columns.length - 1 && (
                          <span
                            className="json-table__resizer"
                            title="resize column"
                            onPointerDown={(e) => onPointerDownResize(e, idx)}
                            role="separator"
                            aria-orientation="vertical"
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {!hasData ? (
                  <tr>
                    <td colSpan={columns.length} className="json-table__empty">
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  pagedData.map((row, rIdx) => (
                    <tr key={`${widgetData?.UUID ?? "uuid"}_r_${rIdx}`}>
                      {columns.map((col, cIdx) => {
                        const raw = Object.values(row)[cIdx];
                        const img = isImageUrl(raw);
                        return (
                          <td
                            key={`${col.key}_c_${cIdx}`}
                            className={`json-table__td ${img ? "json-table__td--img" : ""}`}
                          >
                            {renderCell(raw)}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="json-table__toolbar">
            <div className="json-table__range">
              {hasData ? (
                <>
                  <strong>{fromRow}</strong>–<strong>{toRow}</strong> of{" "}
                  <strong>{totalRows}</strong>
                </>
              ) : (
                <>{emptyMessage}</>
              )}
            </div>

            <div className="json-table__controls">
              <label className="json-table__pagesize">
                rows per page:&nbsp;
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPageIndex(0);
                  }}
                >
                  {pageSizeOptions.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <div className="json-table__pager">
                <button type="button" onClick={() => setPageIndex(0)} disabled={pageIndex === 0}>
                  «
                </button>
                <button
                  type="button"
                  onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                  disabled={pageIndex === 0}
                >
                  ‹
                </button>
                <span className="json-table__pageinfo">
                  page <strong>{pageIndex + 1}</strong> / <strong>{pageCount}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={pageIndex >= pageCount - 1}
                >
                  ›
                </button>
                <button
                  type="button"
                  onClick={() => setPageIndex(pageCount - 1)}
                  disabled={pageIndex >= pageCount - 1}
                >
                  »
                </button>
              </div>
            </div>
          </div>

          <style>{`
            .json-table__scroll { width: 100%; overflow-x: auto; }

            .json-table {
              border-collapse: collapse;
            }

            .json-table colgroup { display: table-column-group !important; }
            .json-table col { display: table-column !important; }

            .json-table th, .json-table td {
              padding: 5px;
              border: 1px solid var(--border-color);
              text-align: left;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              box-sizing: border-box;
              min-width: 0;
            }

            .json-table__td--img { padding: 0; }
            .json-table__td--img img { min-width: 0; max-width: 100%; }

            .json-table thead th {
              background: var(--highlight-color);
              font-weight: 600;
              position: relative;
            }

            .json-table__toolbar{
              display:flex; gap:12px; align-items:center; justify-content:space-between;
              margin: 8px 0 10px 0; padding: 8px 10px;
              background:var(--background-color); border:1px solid var(--border-color); border-radius:2px;
            }
            .json-table__controls{ display:flex; gap:12px; align-items:center; }
            .json-table__pagesize select{ padding:4px 6px; }
            .json-table__pager{ display:flex; align-items:center; gap:6px; }
            .json-table__pager button{
              color:var(--text-color);
              padding:4px 8px; border:1px solid var(--border-color); background: var(--background-color);
              border-radius:4px; cursor:pointer;
            }
            .json-table__pager button:disabled{ opacity:0.5; cursor:not-allowed; }
            .json-table__pageinfo{ margin: 0 6px; color:var(--text-color); }

            .json-table__thContent{
              position: relative;
              display:flex;
              align-items:center;
              justify-content:center;
              gap:8px;
              min-width: 0;
            }
            .json-table__thLabel{ min-width:0; color: var(--text-color); }

            .json-table__resizer{
              position:absolute;
              top:0;
              right:-4px;
              width:8px;
              height:100%;
              cursor: col-resize;
              touch-action: none;
              background: transparent;
            }
            .json-table__resizer::after{
              content:"";
              position:absolute;
              top:0;
              right:0px;
              width:4px;
              height:100%;
              background:var(--border-color);
              opacity:0.7;
            }
            .json-table__resizer:hover::after{ opacity:1; }

            .json-table__td a { color:#0b5bd3; text-decoration: none; }
            .json-table__td a:hover { text-decoration: underline; }
          `}</style>
        </div>
      </ListItem>
    </List>
  );
}