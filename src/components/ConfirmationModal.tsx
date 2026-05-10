'use client';

interface ConfirmationModalProps {
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
}

export function ConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false,
}: ConfirmationModalProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: '0 0 12px' }}>{title}</h2>
        <div style={{ marginBottom: 24, color: 'var(--on-surface-variant)', fontSize: 15, lineHeight: 1.5 }}>
          {message}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn-outline" onClick={onCancel}>{cancelLabel}</button>
          <button
            className={isDangerous ? 'btn-primary' : 'btn-primary'}
            onClick={onConfirm}
            style={isDangerous ? { background: 'var(--error)', color: 'var(--on-error)' } : undefined}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
