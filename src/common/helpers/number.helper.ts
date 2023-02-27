export function toPlainString(num = 0) {
  return ('' + +num).replace(
    /(-?)(\d*)\.?(\d*)e([+-]\d+)/,
    function (a, b, c, d, e) {
      return e < 0
        ? b + '0.' + Array(1 - e - c.length).join('0') + c + d
        : b + c + d + Array(e - d.length + 1).join('0');
    },
  );
}

export function toShorten(num: number, fixed = 2) {
  const units = ['', 'K', 'M', 'B', 'T', 'Q'];
  let count = 0;
  while (num >= 1000) {
    num /= 1000;
    count++;
  }
  for (let i = 0; i < fixed; i++) {
    if (num === +num.toFixed(i)) return num.toFixed(i) + units[count];
  }
  return num.toFixed(2) + units[count];
}
