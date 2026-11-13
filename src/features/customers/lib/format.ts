const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const formatMoney = (value: number) => money.format(value);
export const formatDay = (iso: string) => new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" });