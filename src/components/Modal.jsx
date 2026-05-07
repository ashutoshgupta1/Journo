export function Modal({ children, title, onClose }) {
  return (
    <div className="modal-overlay open" role="dialog" aria-modal="true">
      <div className="modal-box">
        <div className="modal-titlebar">
          <span>{title}</span>
          <button className="modal-close" type="button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDeleteModal({ label, onCancel, onConfirm }) {
  return (
    <Modal title="DELETE ENTRY" onClose={onCancel}>
      <div className="modal-label">Delete "{label}"? This cannot be undone.</div>
      <div className="modal-row">
        <button className="modal-btn" type="button" onClick={onCancel}>
          CANCEL
        </button>
        <button className="modal-btn primary danger" type="button" onClick={onConfirm}>
          DELETE
        </button>
      </div>
    </Modal>
  );
}

export function PasswordModal({ error, mode, onCancel, onChange, onConfirm, password, confirmPassword }) {
  const isSetMode = mode === 'set';
  return (
    <Modal title={isSetMode ? 'SET PASSWORD' : 'LOCK DIARY'} onClose={onCancel}>
      <div className="modal-label">{isSetMode ? 'CREATE A PASSWORD TO LOCK YOUR DIARY' : 'ENTER PASSWORD TO LOCK'}</div>
      <input
        className="modal-input"
        type="password"
        placeholder="••••••"
        maxLength={32}
        value={password}
        onChange={(event) => onChange({ password: event.target.value })}
        onKeyDown={(event) => event.key === 'Enter' && onConfirm()}
      />
      {isSetMode && (
        <input
          className="modal-input"
          type="password"
          placeholder="CONFIRM"
          maxLength={32}
          value={confirmPassword}
          onChange={(event) => onChange({ confirmPassword: event.target.value })}
          onKeyDown={(event) => event.key === 'Enter' && onConfirm()}
        />
      )}
      <div className="modal-err">{error}</div>
      <div className="modal-row">
        <button className="modal-btn" type="button" onClick={onCancel}>
          CANCEL
        </button>
        <button className="modal-btn primary" type="button" onClick={onConfirm}>
          LOCK
        </button>
      </div>
    </Modal>
  );
}
