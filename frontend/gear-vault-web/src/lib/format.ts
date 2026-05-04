export const formatRs = (n: number) =>
  'Rs. ' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
