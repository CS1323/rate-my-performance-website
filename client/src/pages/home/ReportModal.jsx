import { useEffect, useRef } from 'react';
import './ReportModal.css';

export function ReportModal({ isOpen, onClose, onSubmit, isLoading }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const submitButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reason = inputRef.current?.value || '';
    onSubmit(reason);
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const handleCancel = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    }

    // WCAG AA 2.1.2: Focus trap within modal
    if (e.key === 'Tab' && dialogRef.current) {
      const focusable = dialogRef.current.querySelectorAll(
        'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="report-modal"
      onKeyDown={handleKeyDown}
      aria-labelledby="report-dialog-title"
      aria-describedby="report-dialog-desc"
    >
      <div className="report-modal-content">
        <h2 id="report-dialog-title">Report Comment</h2>
        <p id="report-dialog-desc">
          Help us keep the community safe. Why are you reporting this comment?
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="report-reason">Reason (optional)</label>
            <textarea
              ref={inputRef}
              id="report-reason"
              placeholder="Let us know why you're reporting this comment..."
              maxLength="500"
              rows="4"
              disabled={isLoading}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              ref={submitButtonRef}
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Report'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
