export function numberWithCommas(x: number) {
  return x.toLocaleString('en-US', {
    minimumFractionDigits: 0, // shoud use for android
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'VND',
  })
}
