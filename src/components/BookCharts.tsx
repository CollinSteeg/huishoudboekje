import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import type { CategoryExpense, MonthlyStats } from '../utils/chartHelpers'
import { formatCurrency } from '../utils/formatCurrency'

interface BookChartsProps {
  monthlyData: MonthlyStats[]
  categoryData: CategoryExpense[]
}

export function BookCharts({ monthlyData, categoryData }: BookChartsProps) {
  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h2 className="chart-card__title">Inkomsten en uitgaven per maand</h2>
        {monthlyData.length === 0 ? (
          <p className="chart-card__empty">Nog geen transacties om weer te geven.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 12 }} width={80} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                name="Inkomsten"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Uitgaven"
                stroke="#dc2626"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="chart-card">
        <h2 className="chart-card__title">Uitgaven per categorie</h2>
        {categoryData.length === 0 ? (
          <p className="chart-card__empty">Geen uitgaven in deze maand.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 12 }} width={80} />
              <Bar dataKey="amount" name="Uitgaven" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
