import type { Product } from "@/types/product";

export function hasWeight(weight: Product["weight"]): weight is number {
  return typeof weight === "number" && Number.isFinite(weight);
}

export function formatWeight(weight: Product["weight"]) {
  if (!hasWeight(weight)) {
    return "待补充";
  }

  return `${weight}g`;
}

export function formatWeightNumber(weight: Product["weight"]) {
  if (!hasWeight(weight)) {
    return "待补充";
  }

  return weight;
}

export function getValidWeights(products: Product[]) {
  return products
    .map((product) => product.weight)
    .filter((weight): weight is number => hasWeight(weight));
}

export function getLightestWeight(products: Product[]) {
  const validWeights = getValidWeights(products);

  if (validWeights.length === 0) {
    return null;
  }

  return Math.min(...validWeights);
}

export function sortByWeightAsc(a: Product, b: Product) {
  const aWeight = a.weight;
  const bWeight = b.weight;

  const aHasWeight = hasWeight(aWeight);
  const bHasWeight = hasWeight(bWeight);

  if (!aHasWeight && !bHasWeight) {
    return 0;
  }

  if (!aHasWeight) {
    return 1;
  }

  if (!bHasWeight) {
    return -1;
  }

  return aWeight - bWeight;
}

export function sortByWeightDesc(a: Product, b: Product) {
  const aWeight = a.weight;
  const bWeight = b.weight;

  const aHasWeight = hasWeight(aWeight);
  const bHasWeight = hasWeight(bWeight);

  if (!aHasWeight && !bHasWeight) {
    return 0;
  }

  if (!aHasWeight) {
    return 1;
  }

  if (!bHasWeight) {
    return -1;
  }

  return bWeight - aWeight;
}