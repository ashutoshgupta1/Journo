import { formatShort, monthLabel, todayKey } from '../lib/date.js';
import { useMemo, useState } from 'react';

export function Sidebar({ currentDate, entries, onCreate, onDelete, onSelect }) {
  const keys = Object.keys(entries).sort((a, b) => b.localeCompare(a));

  const groups = useMemo(() => {
    const map = new Map();
    keys.forEach((iso) => {
      const m = monthLabel(iso);
      if (!map.has(m)) map.set(m, []);
      map.get(m).push(iso);
    });
    return map;
  }, [keys]);

  const monthKeys = Array.from(groups.keys());

  const [openMonths, setOpenMonths] = useState(() => {
    if (monthKeys.length <= 1) return {};
    const initial = {};
    const currentMonth = monthLabel(currentDate);
    monthKeys.forEach((m) => {
      initial[m] = m === currentMonth;
    });
    return initial;
  });

  function toggleMonth(m) {
    setOpenMonths((cur) => ({ ...cur, [m]: !cur[m] }));
  }

  const singleMonth = monthKeys.length <= 1;

  return (
    <aside className="sidebar">
      <div className="sidebar-label">ENTRIES</div>
      <div className="sidebar-entries">
        {monthKeys.map((month) => (
          <div className="month-section" key={month}>
            {!singleMonth ? (
              <button
                type="button"
                className="month-header"
                onClick={() => toggleMonth(month)}
                aria-expanded={!!openMonths[month]}
              >
                <span className="month-label">{month}</span>
                <span className={`month-chevron ${openMonths[month] ? 'open' : ''}`} aria-hidden>
                  ▸
                </span>
              </button>
            ) : (
              <div className="sidebar-month">{month}</div>
            )}

            <div className={`month-entries ${singleMonth || openMonths[month] ? 'open' : 'collapsed'}`}>
              {groups.get(month).map((iso) => (
                <div className="entry-group" key={iso}>
                  <button
                    className={`entry-item ${iso === currentDate ? 'active' : ''}`}
                    type="button"
                    onClick={() => onSelect(iso)}
                  >
                    <span className="e-info">
                      <span className="e-date">{formatShort(iso)}</span>
                      {iso === todayKey() && <span className="e-sub">today</span>}
                    </span>
                    <span
                      className="e-del"
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(iso);
                      }}
                    >
                      ✕
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!entries[todayKey()] && (
        <button className="sidebar-new" type="button" onClick={onCreate}>
          + NEW
        </button>
      )}
    </aside>
  );
}
