export function formatDate(iso) {
  if (!iso) return ''
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
  if (!match) return iso
  const [, year, month, day, hour, minute] = match
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const h = parseInt(hour, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year} ${h12}:${minute} ${ampm}`
}
