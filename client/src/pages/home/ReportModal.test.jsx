import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { ReportModal } from './ReportModal';

describe('ReportModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HTMLDialogElement.prototype.showModal = vi.fn(function () {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.close = vi.fn(function () {
      this.removeAttribute('open');
    });
  });

  test('opens dialog and submits reason', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(<ReportModal isOpen={true} onClose={onClose} onSubmit={onSubmit} isLoading={false} />);

    await user.type(screen.getByLabelText('Reason (optional)'), 'Spam');
    await user.click(screen.getByRole('button', { name: 'Report' }));

    expect(onSubmit).toHaveBeenCalledWith('Spam');
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  test('cancel closes modal and triggers onClose', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(<ReportModal isOpen={true} onClose={onClose} onSubmit={onSubmit} isLoading={false} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
