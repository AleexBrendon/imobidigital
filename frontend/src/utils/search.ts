export function matchesSearch(item: any, search: string) {
  if (!search) return true;

  return JSON.stringify(item)
    .toLowerCase()
    .includes(search.toLowerCase().trim());
}