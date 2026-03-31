import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './ReportModal.css';

export function ReportModal({ isOpen, onClose, onSubmit, isLoading }) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const submitButtonRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      triggerRef.current = document.activeElement;
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
    triggerRef.current?.focus();
  };

  const handleCancel = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    triggerRef.current?.focus();
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
        <h2 id="report-dialog-title">{t('report.heading')}</h2>
        <p id="report-dialog-desc">
          {t('report.description')}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="report-reason">{t('report.reasonLabel')}</label>
            <textarea
              ref={inputRef}
              id="report-reason"
              placeholder={t('report.reasonPlaceholder')}
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
              {t('report.cancel')}
            </button>
            <button
              ref={submitButtonRef}
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? t('report.submitting') : t('report.submit')}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
