import type { ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  title: string
  open: boolean
  onClose: () => void
  showCloseButton?: boolean
  children: ReactNode
}

export function Modal({ title, open, onClose, showCloseButton = true, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{title}</h2>
          {showCloseButton && (
            <Button variant="ghost" onClick={onClose} aria-label="Sluiten">
              ×
            </Button>
          )}
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}
