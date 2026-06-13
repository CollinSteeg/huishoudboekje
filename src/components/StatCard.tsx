import { formatCurrency } from '../utils/formatCurrency'

interface StatCardProps {
  label: string
  amount: number
  variant?: 'income' | 'expense' | 'balance'
}

export function StatCard({ label, amount, variant = 'balance' }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__amount">{formatCurrency(amount)}</strong>
    </div>
  )
}
