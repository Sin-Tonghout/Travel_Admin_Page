const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export const formatTravelers = (adults: number, children: number) =>
  `${plural(adults, "adult", "adults")}${children > 0 ? ` · ${plural(children, "child", "children")}` : ""}`;