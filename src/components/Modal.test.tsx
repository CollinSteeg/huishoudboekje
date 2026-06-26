import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal title="Test" open={false} onClose={vi.fn()}>
        Inhoud
      </Modal>,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders title and children when open', () => {
    render(
      <Modal title="Nieuw boekje" open onClose={vi.fn()}>
        <p>Formulier</p>
      </Modal>,
    )
    expect(screen.getByRole('heading', { name: 'Nieuw boekje' })).toBeInTheDocument()
    expect(screen.getByText('Formulier')).toBeInTheDocument()
  })

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal title="Test" open onClose={onClose}>
        Inhoud
      </Modal>,
    )
    await user.click(screen.getByText('Inhoud').closest('.modal-overlay')!)
    expect(onClose).toHaveBeenCalledOnce()
  })
})
