export function isCategoryExpired(endDate?: Date | null): boolean {
  if (!endDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)
  return end < today
}
