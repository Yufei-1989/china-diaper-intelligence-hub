import Link from "next/link";
import CompareExplorer from "@/components/CompareExplorer";
import productsData from "@/data/products.json";
import type { Product } from "@/types/product";

const products = productsData as Product[];

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-16">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex text-sm font-medium text-neutral-500 transition hover:text-neutral-950"
          >
            ← 返回首页
          </Link>

          <p className="text-sm text-neutral-400">
            共 {products.length} 个产品
          </p>
        </div>

        <div className="mb-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-neutral-400">
            Compare
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 md:text-6xl">
            产品对比
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 md:text-lg">
            选择你关心的纸尿裤产品，横向比较设计、材质、性能和核心卖点。
          </p>
        </div>

        <CompareExplorer products={products} />
      </section>
    </main>
  );
}