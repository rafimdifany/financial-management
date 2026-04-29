export function formatCurrency(amount: number, currency = "IDR"): string {
  if (currency === "IDR") {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  }
  return amount.toLocaleString();
}
