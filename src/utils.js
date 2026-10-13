export const typeLabel = type => ({
  ANNUAL: 'Annual leave',
  SICK: 'Sick leave',
  CASUAL: 'Casual leave'
}[type] || type)

export const shortDate = value => {
  if (!value) return '—'
  const d = new Date(`${value}T00:00:00`)
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}

export const dateRange = (start, end) => `${shortDate(start)} – ${shortDate(end)}`

export const initials = name => (name || 'U')
  .split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()

export const daysInclusive = (start, end) => {
  if (!start || !end) return 0
  return Math.round((new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`)) / 86400000) + 1
}
