export const formatAmount = (amount: number) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
  });
};

export const limitCharacters = (str: string, limit: number) => {
  return str.length > limit ? str.substring(0, limit) + '...' : str
}