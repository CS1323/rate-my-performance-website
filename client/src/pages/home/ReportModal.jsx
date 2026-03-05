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
