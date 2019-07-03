export function range(from, to) {
  const arr = [];

  for (let i = 0, j = from; j <= to; j = from + ++i) {
    arr[i] = j;
  }

  return arr;
}
