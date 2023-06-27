export const formatAmount = (amount?: number) => {
  return (amount || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
  });
};

export const limitCharacters = (str: string, limit: number) => {
  return String(str).length > limit
    ? String(str).substring(0, limit) + "..."
    : str;
};
