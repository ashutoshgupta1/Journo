export function LockScreen({ error, password, title, onChange, onSubmit }) {
  return (
    <div className="lock-screen active">
      <div className="lock-cover-left">
        <div className="cover-title-wrap">
          <div className="cover-ornament">✦ ✦ ✦</div>
          <div className="cover-divider" />
          <div className="cover-main-title">{title.replace('.exe', '').trim()}</div>
          <div className="cover-divider" />
          <div className="cover-subtitle">a private journal</div>
          <div className="cover-year">{new Date().getFullYear()}</div>
        </div>
      </div>
      <div className="lock-cover-spine" />
      <div className="lock-screen-inner">
        <div className="lock-screen-icon">🔒</div>
        <div className="lock-screen-title">This Diary Is Locked</div>
        <div className="lock-screen-sub">enter your password to open it.</div>
        <div className="lock-screen-pw-row">
          <input
            className="lock-screen-input"
            type="password"
            placeholder="••••••"
            maxLength={32}
            value={password}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && onSubmit()}
          />
          <button className="lock-screen-btn" type="button" onClick={onSubmit}>
            Open →
          </button>
        </div>
        <div className="lock-screen-err">{error}</div>
        <div className="lock-screen-hint">Press Enter or click Open to unlock</div>
      </div>
    </div>
  );
}
