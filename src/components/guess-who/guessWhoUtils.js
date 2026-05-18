export function toggleEliminated(list, name) {
  const lower = name.toLowerCase();
  const idx = list.findIndex((n) => n.toLowerCase() === lower);
  if (idx >= 0) return list.filter((_, i) => i !== idx);
  return [...list, name];
}

export function isEliminated(eliminated, name) {
  const lower = name.toLowerCase();
  return eliminated.some((n) => n.toLowerCase() === lower);
}
