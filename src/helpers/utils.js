export function range(from, to) {
  const arr = [];

  for (let i = 0, j = from; j <= to; j = from + ++i) {
    arr[i] = j;
  }

  return arr;
}

export function getRandomType(types) {
  const { length } = types;

  const type = types[(Math.round(Math.random() * 10) % length)]

  return type
}

