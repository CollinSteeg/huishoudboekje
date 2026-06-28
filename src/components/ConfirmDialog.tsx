import { Button } from './Button'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Bevestigen',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} open={open} onClose={onCancel} showCloseButton={false}>
      <p className="confirm-dialog__message">{message}</p>
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Annuleren
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Bezig...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
