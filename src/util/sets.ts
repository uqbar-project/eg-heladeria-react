export const differenceBy = <T, U> (
  array: T[],
  values: T[],
  iteratee: (item: T) => U
): T[] => {
  const set = new Set(values.map(iteratee))
  return array.filter(item => !set.has(iteratee(item)))
}

export const isEmpty = (array: unknown[]) => !array.length