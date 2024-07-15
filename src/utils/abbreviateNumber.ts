function abbreviateNumber(value: number): string {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  let suffixIndex = 0;

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  return Math.floor(value) + suffixes[suffixIndex];
}

const getFormattedNumber = (value: number) => {
  if (value === 0) return '0';
  const sign = value >= 0 ? '+' : '-';
  return sign + abbreviateNumber(Math.abs(value));
};

export default abbreviateNumber;

export { getFormattedNumber };
