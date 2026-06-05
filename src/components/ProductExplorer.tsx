"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";
import {
  sortByWeightAsc,
  sortByWeightDesc,
} from "@/utils/productDisplay";

type ProductExplorerProps = {
  products: Product[];
};

type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "weight-asc"
  | "weight-desc"
  | "launch-desc"
  | "launch-asc";

function getUniqueValues(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean))
  );
}

function toggleValue(currentValues: string[], value: string) {
  if (currentValues.includes(value)) {
    return currentValues.filter((item) => item !== value);
  }

  return [...currentValues, value];
}

function matchesMultiSelect(value: string, selectedValues: string[]) {
  if (selectedValues.length === 0) {
    return true;
  }

  return selectedValues.includes(value);
}

function MultiSelectFilter({
  title,
  options,
  selectedValues,
  onToggle,
  onClear,
}: {
  title: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-neutral-700">{title}</p>

        {selectedValues.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-neutral-400 transition hover:text-neutral-950"
          >
            清空
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selectedValues.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-neutral-950 text-white"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-950 hover:text-neutral-950",
              ].join(" ")}
            >
              {isActive ? "✓ " : ""}
              {option}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-neutral-400">
        {selectedValues.length > 0
          ? `已选 ${selectedValues.length} 项`
          : "未选择时默认显示全部"}
      </p>
    </div>
  );
}

export default function ProductExplorer({ products }: ProductExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const brands = useMemo(() => {
    return getUniqueValues(products.map((product) => product.brand));
  }, [products]);

  const forms = useMemo(() => {
    return getUniqueValues(products.map((product) => product.form));
  }, [products]);

  const tiers = useMemo(() => {
    const tierOrder = ["SP", "P", "V", "E"];

    const uniqueTiers = getUniqueValues(products.map((product) => product.tier));

    return uniqueTiers.sort((a, b) => {
      const indexA = tierOrder.indexOf(a);
      const indexB = tierOrder.indexOf(b);

      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b);
      }

      if (indexA === -1) {
        return 1;
      }

      if (indexB === -1) {
        return -1;
      }

      return indexA - indexB;
    });
  }, [products]);

  const sizes = useMemo(() => {
    const sizeOrder = ["NB", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];

    const uniqueSizes = getUniqueValues(products.map((product) => product.size));

    return uniqueSizes.sort((a, b) => {
      const indexA = sizeOrder.indexOf(a);
      const indexB = sizeOrder.indexOf(b);

      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b);
      }

      if (indexA === -1) {
        return 1;
      }

      if (indexB === -1) {
        return -1;
      }

      return indexA - indexB;
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesBrand = matchesMultiSelect(
        product.brand,
        selectedBrands
      );

      const matchesForm = matchesMultiSelect(product.form, selectedForms);

      const matchesTier = matchesMultiSelect(product.tier, selectedTiers);

      const matchesSize = matchesMultiSelect(product.size, selectedSizes);

      const searchableText = [
        product.id,
        product.productFamilyId,
        product.brand,
        product.series,
        product.generation,
        product.versionName,
        product.babySize,
        product.tier,
        product.launchTime,
        product.launchMonth,
        product.form,
        product.size,
        product.claim1,
        product.claim2,
        product.claim3,
        product.designProductDimension,
        product.designCore,
        product.designTopsheet,
        product.designBacksheet,
        product.designFasteningSystem,
        product.designAesthetic,
        product.designPackage,
        product.designAccessories,
        product.performanceGbAbsorbency,
        product.marketingCoreSellingPoint,
        product.marketingAbsorbency,
        product.marketingLeakProtection,
        product.marketingSkinComfort,
        product.marketingFitAntiChafe,
        product.marketingAppearanceDesign,
        product.ratingConsumerFeedback,
        product.ratingMarketPerformance,
        product.ratingCostRating,
        String(product.price),
        product.weight === null ? "" : String(product.weight),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !keyword || searchableText.includes(keyword);

      return (
        matchesBrand &&
        matchesForm &&
        matchesTier &&
        matchesSize &&
        matchesSearch
      );
    });

    const sortedResult = [...result];

    if (sortOption === "price-asc") {
      sortedResult.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "price-desc") {
      sortedResult.sort((a, b) => b.price - a.price);
    }

    if (sortOption === "weight-asc") {
      sortedResult.sort(sortByWeightAsc);
    }

    if (sortOption === "weight-desc") {
      sortedResult.sort(sortByWeightDesc);
    }

    if (sortOption === "launch-desc") {
      sortedResult.sort((a, b) => b.launchMonth.localeCompare(a.launchMonth));
    }

    if (sortOption === "launch-asc") {
      sortedResult.sort((a, b) => a.launchMonth.localeCompare(b.launchMonth));
    }

    return sortedResult;
  }, [
    products,
    searchQuery,
    selectedBrands,
    selectedForms,
    selectedTiers,
    selectedSizes,
    sortOption,
  ]);

  const activeFilterCount =
    selectedBrands.length +
    selectedForms.length +
    selectedTiers.length +
    selectedSizes.length;

  return (
    <div>
      <div className="mb-8 rounded-[2rem] border border-neutral-200 bg-neutral-50 p-4 md:p-5">
        <div className="grid gap-5 md:grid-cols-[1fr_240px_auto] md:items-end">
          <div>
            <label
              htmlFor="product-search"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              搜索产品
            </label>

            <input
              id="product-search"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="搜索品牌、系列、版本、尺码、设计、卖点、评级..."
              className="w-full rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
            />
          </div>

          <div>
            <label
              htmlFor="product-sort"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              排序
            </label>

            <select
              id="product-sort"
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as SortOption)
              }
              className="w-full rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm text-neutral-950 outline-none transition focus:border-neutral-950"
            >
              <option value="default">默认排序</option>
              <option value="price-asc">价格从低到高</option>
              <option value="price-desc">价格从高到低</option>
              <option value="weight-asc">重量从轻到重</option>
              <option value="weight-desc">重量从重到轻</option>
              <option value="launch-desc">上市时间从新到旧</option>
              <option value="launch-asc">上市时间从旧到新</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedBrands([]);
              setSelectedForms([]);
              setSelectedTiers([]);
              setSelectedSizes([]);
              setSortOption("default");
            }}
            className="rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
          >
            清空筛选
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          <MultiSelectFilter
            title="品牌筛选"
            options={brands}
            selectedValues={selectedBrands}
            onToggle={(brand) =>
              setSelectedBrands((currentValues) =>
                toggleValue(currentValues, brand)
              )
            }
            onClear={() => setSelectedBrands([])}
          />

          <MultiSelectFilter
            title="Form 筛选"
            options={forms}
            selectedValues={selectedForms}
            onToggle={(form) =>
              setSelectedForms((currentValues) =>
                toggleValue(currentValues, form)
              )
            }
            onClear={() => setSelectedForms([])}
          />

          <MultiSelectFilter
            title="Tier 筛选"
            options={tiers}
            selectedValues={selectedTiers}
            onToggle={(tier) =>
              setSelectedTiers((currentValues) =>
                toggleValue(currentValues, tier)
              )
            }
            onClear={() => setSelectedTiers([])}
          />

          <MultiSelectFilter
            title="尺码筛选"
            options={sizes}
            selectedValues={selectedSizes}
            onToggle={(size) =>
              setSelectedSizes((currentValues) =>
                toggleValue(currentValues, size)
              )
            }
            onClear={() => setSelectedSizes([])}
          />
        </div>

        <p className="mt-5 text-sm text-neutral-500">
          当前显示 {filteredProducts.length} / {products.length} 个产品
          {activeFilterCount > 0 ? ` · 已启用 ${activeFilterCount} 个筛选项` : ""}
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
          产品列表
        </h2>

        <p className="text-sm text-neutral-500">
          共 {filteredProducts.length} 个产品
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-neutral-300 bg-white p-10 text-center">
          <p className="text-lg font-medium text-neutral-950">
            没有找到匹配产品
          </p>

          <p className="mt-2 text-sm text-neutral-500">
            试试减少品牌、Form、Tier 或尺码筛选，或者换一个搜索关键词。
          </p>
        </div>
      )}
    </div>
  );
}