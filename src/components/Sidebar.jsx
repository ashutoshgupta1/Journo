import { formatShort, monthLabel, todayKey } from '../lib/date.js';

export function Sidebar({ currentDate, entries, onCreate, onDelete, onSelect }) {
  const keys = Object.keys(entries).sort((a, b) => b.localeCompare(a));
  let lastMonth = '';

  return (
    <aside className="sidebar">
      <div className="sidebar-label">ENTRIES</div>
      <div className="sidebar-entries">
        {keys.map((iso) => {
          const month = monthLabel(iso);
          const showMonth = month !== lastMonth;
          lastMonth = month;
          return (
            <div className="entry-group" key={iso}>
              {showMonth && <div className="sidebar-month">{month}</div>}
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
          );
        })}
      </div>
      {!entries[todayKey()] && (
        <button className="sidebar-new" type="button" onClick={onCreate}>
          + NEW
        </button>
      )}
    </aside>
  );
}
