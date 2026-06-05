import Link from "next/link";
import ProductExplorer from "@/components/ProductExplorer";
import ProductStats from "@/components/ProductStats";
import productsData from "@/data/products.json";
import type { Product } from "@/types/product";

const products = productsData as Product[];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-16">
        <div className="mb-10 md:mb-14">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-neutral-400">
            China Diaper Intelligence Hub
          </p>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 md:text-6xl">
                纸尿裤琅琊阁
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 md:text-lg">
                基于产品主数据，快速查看不同纸尿裤的品牌、系列、版本、尺码、价格、设计与核心卖点。
              </p>
            </div>

            <Link
              href="/compare"
              className="inline-flex w-fit items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              产品对比 →
            </Link>
          </div>
        </div>

        <ProductStats products={products} />

        <ProductExplorer products={products} />
      </section>
    </main>
  );
}