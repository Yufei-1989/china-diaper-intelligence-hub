import type { Product } from "@/types/product";
import { formatWeight, getLightestWeight } from "@/utils/productDisplay";

type ProductStatsProps = {
  products: Product[];
};

function getUniqueValues(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean))
  );
}

function getUniqueCount(values: string[]) {
  return getUniqueValues(values).length;
}

function formatStatValue(value: string | number) {
  if (value === "" || value === null || value === undefined) {
    return "-";
  }

  return value;
}

function normalizeDesignProfile(content: string) {
  return String(content || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" | ");
}

function getUniqueDesignProfileCount(values: string[]) {
  return getUniqueValues(values.map((value) => normalizeDesignProfile(value)))
    .length;
}

export default function ProductStats({ products }: ProductStatsProps) {
  const totalProducts = products.length;

  const brandCount = getUniqueCount(products.map((product) => product.brand));
  const formCount = getUniqueCount(products.map((product) => product.form));

  /**
   * Tier 是产品档位体系，不只统计当前数据中出现的档位。
   * 即使当前 products.json 里暂时没有 E，也展示完整体系：SP / P / V / E。
   */
  const tierSystem = ["SP", "P", "V", "E"];
  const tierCount = tierSystem.length;

  const highestPrice =
    products.length > 0
      ? Math.max(...products.map((product) => product.price))
      : 0;

  const lightestWeight = getLightestWeight(products);

  const newestLaunchMonth =
    products.length > 0
      ? [...products]
          .map((product) => product.launchMonth)
          .filter(Boolean)
          .sort()
          .reverse()[0]
      : "";

  /**
   * 统计逻辑：
   * 内表层种类 = 整个 designTopsheet 字段完整内容去重
   * 外表层种类 = 整个 designBacksheet 字段完整内容去重
   *
   * 只要字段里的任意信息不同，例如材质、克重、宽度、花型、精华不同，
   * 就会被统计为一个新种类。
   */
  const topsheetProfileCount = getUniqueDesignProfileCount(
    products.map((product) => product.designTopsheet)
  );

  const backsheetProfileCount = getUniqueDesignProfileCount(
    products.map((product) => product.designBacksheet)
  );

  const stats = [
    {
      label: "产品数量",
      value: totalProducts,
      suffix: "个",
      description: "当前数据库收录产品",
    },
    {
      label: "品牌数量",
      value: brandCount,
      suffix: "个",
      description: "覆盖不同品牌",
    },
    {
      label: "产品形态",
      value: formCount,
      suffix: "种",
      description: "Taped / Pants 等",
    },
    {
      label: "产品档位",
      value: tierCount,
      suffix: "档",
      description: "SP / P / V / E",
    },
    {
      label: "最高单片价",
      value: `¥${highestPrice}`,
      suffix: "",
      description: "按当前产品库计算",
    },
    {
      label: "最轻单片重",
      value: formatWeight(lightestWeight),
      suffix: "",
      description: "忽略待补充 Weight 的产品",
    },
    {
      label: "最新上市",
      value: formatStatValue(newestLaunchMonth),
      suffix: "",
      description: "按 LaunchMonth 判断",
    },
    {
      label: "内表层种类",
      value: topsheetProfileCount,
      suffix: "种",
      description: "按完整内表层字段组合去重",
    },
    {
      label: "外表层种类",
      value: backsheetProfileCount,
      suffix: "种",
      description: "按完整外表层字段组合去重",
    },
  ];

  return (
    <section className="mb-10">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
            Database Snapshot
          </p>

          <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
            产品数据库概览
          </h2>
        </div>

        <p className="text-sm text-neutral-500">
          基于当前 products.json 自动统计
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-9">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-neutral-500">
              {stat.label}
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {stat.value}
              {stat.suffix}
            </p>

            <p className="mt-2 text-xs leading-5 text-neutral-500">
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}