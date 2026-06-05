"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/types/product";
import {
  formatWeight,
  getLightestWeight,
  hasWeight,
} from "@/utils/productDisplay";

type CompareExplorerProps = {
  products: Product[];
};

type CompareRowProps = {
  label: string;
  values: {
    productId: string;
    content: ReactNode;
  }[];
  columnTemplate: string;
};

function CompareRow({ label, values, columnTemplate }: CompareRowProps) {
  return (
    <div
      className="grid border-t border-neutral-200"
      style={{ gridTemplateColumns: columnTemplate }}
    >
      <div className="sticky left-0 z-20 bg-white px-4 py-5 text-sm font-medium text-neutral-500">
        {label}
      </div>

      {values.map((value) => (
        <div
          key={value.productId}
          className="px-4 py-5 text-sm leading-6 text-neutral-900"
        >
          {value.content}
        </div>
      ))}
    </div>
  );
}

function SectionRow({
  title,
  columnTemplate,
}: {
  title: string;
  columnTemplate: string;
}) {
  return (
    <div
      className="grid border-t border-neutral-200 bg-neutral-50"
      style={{ gridTemplateColumns: columnTemplate }}
    >
      <div className="sticky left-0 z-20 bg-neutral-50 px-4 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-400">
        {title}
      </div>

      <div
        className="px-4 py-4 text-sm font-medium text-neutral-400"
        style={{ gridColumn: "2 / -1" }}
      >
        对比维度
      </div>
    </div>
  );
}

function HighlightBadge({ children }: { children: ReactNode }) {
  return (
    <span className="ml-2 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      {children}
    </span>
  );
}

function TextValue({ children }: { children: ReactNode }) {
  return <p className="whitespace-pre-wrap break-words">{children}</p>;
}

function CompareBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "dark" | "green" | "blue" | "amber";
}) {
  const toneClassMap = {
    neutral: "bg-neutral-100 text-neutral-700",
    dark: "bg-neutral-950 text-white",
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        toneClassMap[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function getRepeatedCharScore(value: string, char: string) {
  return value.split("").filter((item) => item === char).length;
}

function getTierTone(tier: string): "dark" | "blue" | "green" | "neutral" {
  if (tier === "SP") {
    return "dark";
  }

  if (tier === "P") {
    return "blue";
  }

  if (tier === "V") {
    return "green";
  }

  return "neutral";
}

function getTierLabel(tier: string) {
  const tierLabelMap: Record<string, string> = {
    SP: "SP · Super Premium",
    P: "P · Premium",
    V: "V · Value",
    E: "E · Entry",
  };

  return tierLabelMap[tier] || tier;
}

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

export default function CompareExplorer({ products }: CompareExplorerProps) {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    products.slice(0, 4).map((product) => product.id)
  );

  const [selectedPickerBrands, setSelectedPickerBrands] = useState<string[]>(
    []
  );
  const [selectedPickerForms, setSelectedPickerForms] = useState<string[]>([]);
  const [selectedPickerTiers, setSelectedPickerTiers] = useState<string[]>([]);
  const [selectedPickerSizes, setSelectedPickerSizes] = useState<string[]>([]);

  const selectedProducts = useMemo(() => {
    return products.filter((product) => selectedProductIds.includes(product.id));
  }, [products, selectedProductIds]);

  const pickerBrands = useMemo(() => {
    return getUniqueValues(products.map((product) => product.brand));
  }, [products]);

  const pickerForms = useMemo(() => {
    return getUniqueValues(products.map((product) => product.form));
  }, [products]);

  const pickerTiers = useMemo(() => {
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

  const pickerSizes = useMemo(() => {
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

  const filteredPickerProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesBrand = matchesMultiSelect(
        product.brand,
        selectedPickerBrands
      );

      const matchesForm = matchesMultiSelect(
        product.form,
        selectedPickerForms
      );

      const matchesTier = matchesMultiSelect(
        product.tier,
        selectedPickerTiers
      );

      const matchesSize = matchesMultiSelect(
        product.size,
        selectedPickerSizes
      );

      return matchesBrand && matchesForm && matchesTier && matchesSize;
    });
  }, [
    products,
    selectedPickerBrands,
    selectedPickerForms,
    selectedPickerTiers,
    selectedPickerSizes,
  ]);

  const bestPrice = useMemo(() => {
    if (selectedProducts.length === 0) {
      return null;
    }

    return Math.min(...selectedProducts.map((product) => product.price));
  }, [selectedProducts]);

  const lightestWeight = useMemo(() => {
    return getLightestWeight(selectedProducts);
  }, [selectedProducts]);

  const bestMarketPerformanceScore = useMemo(() => {
    if (selectedProducts.length === 0) {
      return null;
    }

    return Math.max(
      ...selectedProducts.map((product) =>
        getRepeatedCharScore(product.ratingMarketPerformance, "A")
      )
    );
  }, [selectedProducts]);

  const lowestCostRatingScore = useMemo(() => {
    if (selectedProducts.length === 0) {
      return null;
    }

    return Math.min(
      ...selectedProducts.map((product) =>
        getRepeatedCharScore(product.ratingCostRating, "$")
      )
    );
  }, [selectedProducts]);

  const productColumnCount = Math.max(selectedProducts.length, 1);
  const productColumnWidth = 280;
  const rowLabelWidth = 180;
  const tableWidth = rowLabelWidth + productColumnCount * productColumnWidth;

  const columnTemplate = `${rowLabelWidth}px repeat(${productColumnCount}, ${productColumnWidth}px)`;

  function toggleProduct(productId: string) {
    setSelectedProductIds((currentIds) => {
      if (currentIds.includes(productId)) {
        return currentIds.filter((id) => id !== productId);
      }

      return [...currentIds, productId];
    });
  }

  function selectAllProducts() {
    setSelectedProductIds(products.map((product) => product.id));
  }

  function clearSelectedProducts() {
    setSelectedProductIds([]);
  }

  function selectFilteredProducts() {
    const filteredIds = filteredPickerProducts.map((product) => product.id);

    setSelectedProductIds((currentIds) =>
      Array.from(new Set([...currentIds, ...filteredIds]))
    );
  }

  function clearPickerFilters() {
    setSelectedPickerBrands([]);
    setSelectedPickerForms([]);
    setSelectedPickerTiers([]);
    setSelectedPickerSizes([]);
  }

  const activePickerFilterCount =
    selectedPickerBrands.length +
    selectedPickerForms.length +
    selectedPickerTiers.length +
    selectedPickerSizes.length;

  return (
    <div>
      <div className="mb-8 rounded-[2rem] border border-neutral-200 bg-neutral-50 p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-700">选择对比产品</p>
            <p className="mt-1 text-sm text-neutral-500">
              当前已选择 {selectedProducts.length} / {products.length} 个产品
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={selectAllProducts}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
            >
              全选
            </button>

            <button
              type="button"
              onClick={clearSelectedProducts}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
            >
              清空
            </button>
          </div>
        </div>

        <div className="mb-5 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          <MultiSelectFilter
            title="品牌筛选"
            options={pickerBrands}
            selectedValues={selectedPickerBrands}
            onToggle={(brand) =>
              setSelectedPickerBrands((currentValues) =>
                toggleValue(currentValues, brand)
              )
            }
            onClear={() => setSelectedPickerBrands([])}
          />

          <MultiSelectFilter
            title="Form 筛选"
            options={pickerForms}
            selectedValues={selectedPickerForms}
            onToggle={(form) =>
              setSelectedPickerForms((currentValues) =>
                toggleValue(currentValues, form)
              )
            }
            onClear={() => setSelectedPickerForms([])}
          />

          <MultiSelectFilter
            title="Tier 筛选"
            options={pickerTiers}
            selectedValues={selectedPickerTiers}
            onToggle={(tier) =>
              setSelectedPickerTiers((currentValues) =>
                toggleValue(currentValues, tier)
              )
            }
            onClear={() => setSelectedPickerTiers([])}
          />

          <MultiSelectFilter
            title="尺码筛选"
            options={pickerSizes}
            selectedValues={selectedPickerSizes}
            onToggle={(size) =>
              setSelectedPickerSizes((currentValues) =>
                toggleValue(currentValues, size)
              )
            }
            onClear={() => setSelectedPickerSizes([])}
          />
        </div>

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-neutral-500">
            当前筛选出 {filteredPickerProducts.length} / {products.length}{" "}
            个可选产品
            {activePickerFilterCount > 0
              ? ` · 已启用 ${activePickerFilterCount} 个筛选项`
              : ""}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={selectFilteredProducts}
              className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              选择当前筛选结果
            </button>

            <button
              type="button"
              onClick={clearPickerFilters}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
            >
              清空快速筛选
            </button>
          </div>
        </div>

        {filteredPickerProducts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {filteredPickerProducts.map((product) => {
              const isSelected = selectedProductIds.includes(product.id);

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleProduct(product.id)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isSelected
                      ? "bg-neutral-950 text-white"
                      : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-950 hover:text-neutral-950",
                  ].join(" ")}
                >
                  {isSelected ? "✓ " : ""}
                  {product.brand} {product.series} {product.size}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-6 text-center">
            <p className="text-sm font-medium text-neutral-950">
              当前筛选条件下没有可选产品
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              请减少品牌、Form、Tier 或尺码筛选。
            </p>
          </div>
        )}
      </div>

      {selectedProducts.length > 0 ? (
        <div className="rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-4">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-medium text-neutral-700">对比小窗</p>

              <p className="text-sm text-neutral-500">
                小窗内可上下滚动；底部可左右拖动查看更多产品列
              </p>
            </div>
          </div>

          <div className="max-h-[calc(100vh-180px)] overflow-auto">
            <div
              style={{
                width: tableWidth,
              }}
            >
              <div
                className="sticky top-0 z-30 grid border-b border-neutral-200 bg-neutral-50 shadow-sm"
                style={{ gridTemplateColumns: columnTemplate }}
              >
                <div className="sticky left-0 z-40 bg-neutral-50 px-4 py-6 text-sm font-medium text-neutral-500">
                  产品
                </div>

                {selectedProducts.map((product) => (
                  <div key={product.id} className="px-4 py-6">
                    <Link
                      href={`/products/${product.id}`}
                      className="group block"
                    >
                      <div className="relative mb-4 h-40 overflow-hidden rounded-3xl bg-white">
                        <Image
                          src={product.image}
                          alt={`${product.brand} ${product.series} 产品图片`}
                          fill
                          className="object-contain p-5 transition duration-300 group-hover:scale-105"
                          sizes="260px"
                        />
                      </div>

                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
                          {product.form}
                        </span>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
                          {product.tier}
                        </span>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
                          {product.generation}
                        </span>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
                          {product.size}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-neutral-500">
                        {product.brand}
                      </p>

                      <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">
                        {product.series} {product.size}
                      </h2>

                      <p className="mt-1 text-sm text-neutral-500">
                        {product.versionName}
                      </p>

                      <p className="mt-2 text-sm text-neutral-500 group-hover:text-neutral-950">
                        查看详情 →
                      </p>
                    </Link>
                  </div>
                ))}
              </div>

              <SectionRow title="Basic" columnTemplate={columnTemplate} />

              <CompareRow
                label="Form"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: (
                    <CompareBadge
                      tone={product.form === "Pants" ? "amber" : "neutral"}
                    >
                      {product.form}
                    </CompareBadge>
                  ),
                }))}
              />

              <CompareRow
                label="Tier"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: (
                    <CompareBadge tone={getTierTone(product.tier)}>
                      {getTierLabel(product.tier)}
                    </CompareBadge>
                  ),
                }))}
              />

              <CompareRow
                label="尺码"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: product.size,
                }))}
              />

              <CompareRow
                label="Generation"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: product.generation,
                }))}
              />

              <CompareRow
                label="Version"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: product.versionName,
                }))}
              />

              <CompareRow
                label="BabySize"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: product.babySize,
                }))}
              />

              <CompareRow
                label="上市时间"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: (
                    <div>
                      <p>{product.launchTime}</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {product.launchMonth}
                      </p>
                    </div>
                  ),
                }))}
              />

              <SectionRow title="Value" columnTemplate={columnTemplate} />

              <CompareRow
                label="价格"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => {
                  const isBestPrice =
                    bestPrice !== null && product.price === bestPrice;

                  return {
                    productId: product.id,
                    content: (
                      <div>
                        <span className="text-xl font-semibold text-neutral-950">
                          ¥{product.price} / 片
                        </span>

                        {isBestPrice ? (
                          <HighlightBadge>最低价</HighlightBadge>
                        ) : null}
                      </div>
                    ),
                  };
                })}
              />

              <CompareRow
                label="重量"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => {
                  const isLightest =
                    lightestWeight !== null &&
                    hasWeight(product.weight) &&
                    product.weight === lightestWeight;

                  return {
                    productId: product.id,
                    content: (
                      <div>
                        <span className="text-xl font-semibold text-neutral-950">
                          {formatWeight(product.weight)}
                        </span>

                        {isLightest ? (
                          <HighlightBadge>最轻</HighlightBadge>
                        ) : null}
                      </div>
                    ),
                  };
                })}
              />

              <SectionRow
                title="Product Design"
                columnTemplate={columnTemplate}
              />

              <CompareRow
                label="产品尺寸"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: (
                    <TextValue>{product.designProductDimension}</TextValue>
                  ),
                }))}
              />

              <CompareRow
                label="芯体信息"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: <TextValue>{product.designCore}</TextValue>,
                }))}
              />

              <CompareRow
                label="内表层"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: <TextValue>{product.designTopsheet}</TextValue>,
                }))}
              />

              <CompareRow
                label="内表层图片"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: (
                    <div className="relative h-40 overflow-hidden rounded-3xl bg-neutral-50">
                      <Image
                        src={product.imageTs}
                        alt={`${product.brand} ${product.series} 内表层图片`}
                        fill
                        className="object-contain p-4"
                        sizes="260px"
                      />
                    </div>
                  ),
                }))}
              />

              <CompareRow
                label="外表层"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: <TextValue>{product.designBacksheet}</TextValue>,
                }))}
              />

              <CompareRow
                label="固定系统"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: (
                    <TextValue>{product.designFasteningSystem}</TextValue>
                  ),
                }))}
              />

              <CompareRow
                label="外观设计 / 印花"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: <TextValue>{product.designAesthetic}</TextValue>,
                }))}
              />

              <CompareRow
                label="包装信息"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: <TextValue>{product.designPackage}</TextValue>,
                }))}
              />

              <CompareRow
                label="附件信息"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: <TextValue>{product.designAccessories}</TextValue>,
                }))}
              />

              <SectionRow title="Performance" columnTemplate={columnTemplate} />

              <CompareRow
                label="国标吸收性测试"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: (
                    <TextValue>{product.performanceGbAbsorbency}</TextValue>
                  ),
                }))}
              />

              <SectionRow title="Marketing" columnTemplate={columnTemplate} />

              <CompareRow
                label="核心卖点"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: (
                    <TextValue>{product.marketingCoreSellingPoint}</TextValue>
                  ),
                }))}
              />

              <CompareRow
                label="吸收性能"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: <TextValue>{product.marketingAbsorbency}</TextValue>,
                }))}
              />

              <CompareRow
                label="防漏性能"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: (
                    <TextValue>{product.marketingLeakProtection}</TextValue>
                  ),
                }))}
              />

              <CompareRow
                label="亲肤舒适"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: (
                    <TextValue>{product.marketingSkinComfort}</TextValue>
                  ),
                }))}
              />

              <CompareRow
                label="贴合防磨"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: (
                    <TextValue>{product.marketingFitAntiChafe}</TextValue>
                  ),
                }))}
              />

              <CompareRow
                label="外观设计"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: (
                    <TextValue>{product.marketingAppearanceDesign}</TextValue>
                  ),
                }))}
              />

              <SectionRow title="Rating" columnTemplate={columnTemplate} />

              <CompareRow
                label="消费者反馈"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => ({
                  productId: product.id,
                  content: product.ratingConsumerFeedback,
                }))}
              />

              <CompareRow
                label="市场表现"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => {
                  const marketScore = getRepeatedCharScore(
                    product.ratingMarketPerformance,
                    "A"
                  );

                  const isBestMarket =
                    bestMarketPerformanceScore !== null &&
                    marketScore === bestMarketPerformanceScore;

                  return {
                    productId: product.id,
                    content: (
                      <div>
                        <span className="text-lg font-semibold text-neutral-950">
                          {product.ratingMarketPerformance}
                        </span>

                        {isBestMarket ? (
                          <HighlightBadge>市场高</HighlightBadge>
                        ) : null}
                      </div>
                    ),
                  };
                })}
              />

              <CompareRow
                label="成本评级"
                columnTemplate={columnTemplate}
                values={selectedProducts.map((product) => {
                  const costScore = getRepeatedCharScore(
                    product.ratingCostRating,
                    "$"
                  );

                  const isLowestCost =
                    lowestCostRatingScore !== null &&
                    costScore === lowestCostRatingScore;

                  return {
                    productId: product.id,
                    content: (
                      <div>
                        <span className="text-lg font-semibold text-neutral-950">
                          {product.ratingCostRating}
                        </span>

                        {isLowestCost ? (
                          <HighlightBadge>成本低</HighlightBadge>
                        ) : null}
                      </div>
                    ),
                  };
                })}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-neutral-300 bg-white p-10 text-center">
          <p className="text-lg font-medium text-neutral-950">
            还没有选择对比产品
          </p>

          <p className="mt-2 text-sm text-neutral-500">
            请点击上方产品按钮，选择至少一个产品进行对比。
          </p>

          <button
            type="button"
            onClick={selectAllProducts}
            className="mt-6 rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            一键选择全部产品
          </button>
        </div>
      )}

      <p className="mt-4 text-sm text-neutral-400">
        提示：建议一次选择 2-4 个产品。对比小窗内部支持上下滚动和左右滚动。
      </p>
    </div>
  );
}