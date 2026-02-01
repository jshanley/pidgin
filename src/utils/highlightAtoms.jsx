export function highlightAtoms(html, atoms, onAtomClick) {
  if (!atoms?.length) return html

  let result = html

  for (const atom of atoms) {
    const terms = [atom.term, ...(atom.aliases || [])]

    for (const term of terms) {
      const regex = new RegExp(`\\b(${escapeRegex(term)})\\b`, 'gi')
      result = result.replace(
        regex,
        `<span class="atom-highlight" data-atom="${atom.term}">$1</span>`
      )
    }
  }

  return result
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
