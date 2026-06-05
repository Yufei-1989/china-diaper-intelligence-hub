import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import InfoBlock from "@/components/InfoBlock";
import productsData from "@/data/products.json";
import type { Product } from "@/types/product";
import { formatWeight } from "@/utils/productDisplay";

const products = productsData as Product[];

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  const productTitle = `${product.brand} ${product.series} ${product.size}`;

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex text-sm font-medium text-neutral-500 transition hover:text-neutral-950"
          >
            ← 返回首页
          </Link>

          <Link
            href="/compare"
            className="inline-flex rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            去产品对比 →
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="sticky top-24 overflow-hidden rounded-[2.5rem] border border-neutral-200 bg-neutral-50">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={`${productTitle} 产品图片`}
                fill
                className="object-contain p-8 md:p-12"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white">
                {product.brand}
              </span>

              <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700">
                {product.form}
              </span>

              <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700">
                尺码 {product.size}
              </span>

              <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700">
                {product.tier}
              </span>

              <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700">
                {product.generation}
              </span>

              <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700">
                {product.launchTime}
              </span>

              <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700">
  BabySize {product.babySize}
</span>
            </div>

            <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-neutral-400">
              Product Detail
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 md:text-6xl">
              {product.brand}
            </h1>

            <p className="mt-4 text-2xl text-neutral-800">
              {product.series} {product.size}
            </p>

            <p className="mt-2 text-base font-medium text-neutral-500">
              {product.versionName}
            </p>

            <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600">
              {product.claim1}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-neutral-500">单片价格</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
                  ¥{product.price}
                </p>
                <p className="mt-1 text-sm text-neutral-500">/ 片</p>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-neutral-500">单片重量</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
                  {formatWeight(product.weight)}
                </p>
                <p className="mt-1 text-sm text-neutral-500">克</p>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-neutral-500">上市时间</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
                  {product.launchTime}
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  {product.launchMonth}
                </p>
              </div>
              <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
  <p className="text-sm font-medium text-neutral-500">覆盖尺码</p>
  <p className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
    {product.babySize}
  </p>
  <p className="mt-1 text-sm text-neutral-500">BabySize</p>
</div>
            </div>

            <div className="mt-10">
              <div className="mb-5">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
                  Claims
                </p>

                <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
                  核心卖点
                </h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-[2rem] bg-neutral-50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
                      1
                    </span>
                    <p className="text-sm font-semibold text-neutral-500">
                      核心卖点
                    </p>
                  </div>

                  <p className="text-base leading-8 text-neutral-900">
                    {product.claim1}
                  </p>
                </div>

                <div className="rounded-[2rem] bg-neutral-50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
                      2
                    </span>
                    <p className="text-sm font-semibold text-neutral-500">
                      吸收性能
                    </p>
                  </div>

                  <p className="text-base leading-8 text-neutral-900">
                    {product.claim2}
                  </p>
                </div>

                <div className="rounded-[2rem] bg-neutral-50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
                      3
                    </span>
                    <p className="text-sm font-semibold text-neutral-500">
                      亲肤舒适
                    </p>
                  </div>

                  <p className="text-base leading-8 text-neutral-900">
                    {product.claim3}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/compare"
                className="inline-flex justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                加入对比视图
              </Link>

              <Link
                href="/"
                className="inline-flex justify-center rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
              >
                查看全部产品
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-neutral-200 pt-12">
          <div className="mb-8">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-neutral-400">
              Technical Profile
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
              专业信息
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
              以下信息来自产品主数据，用于帮助读者从设计、性能、宣传和评级四个维度理解产品差异。
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <div className="mb-5">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
                  Product Design
                </p>

                <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                  产品设计
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InfoBlock
                  title="产品尺寸"
                  description="产品整体尺寸、剪裁等结构信息。"
                  content={product.designProductDimension}
                />

                <InfoBlock
                  title="芯体信息"
                  description="芯体类型、尺寸、重量与 AGM 商品名。"
                  content={product.designCore}
                />

                <InfoBlock
                  title="内表层"
                  description="面层材质、克重、花型与精华信息。"
                  content={product.designTopsheet}
                />
                <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
  <div className="mb-4">
    <h3 className="text-lg font-semibold tracking-tight text-neutral-950">
      内表层图片
    </h3>

    <p className="mt-1 text-sm leading-6 text-neutral-500">
      来自 Image_TS 字段；若图片缺失则显示占位图。
    </p>
  </div>

  <div className="relative aspect-square overflow-hidden rounded-3xl bg-neutral-50">
    <Image
      src={product.imageTs}
      alt={`${product.brand} ${product.series} 内表层图片`}
      fill
      className="object-contain p-5"
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  </div>
</div>

                <InfoBlock
                  title="外表层"
                  description="背层材质、克重和外层花型。"
                  content={product.designBacksheet}
                />

                <InfoBlock
                  title="固定系统"
                  description="腰贴或 Belt 等固定结构。"
                  content={product.designFasteningSystem}
                />
                <InfoBlock
  title="外观设计 / 印花"
  description="印花主题、印花款式等视觉设计信息。"
  content={product.designAesthetic}
/>

                <InfoBlock
                  title="附件信息"
                  description="抛弃贴、尿显等辅助设计。"
                  content={product.designAccessories}
                />
                <InfoBlock
  title="包装信息"
  description="包装材质、包装印花、厚度与规格。"
  content={product.designPackage}
/>
              </div>
            </section>

            <section>
              <div className="mb-5">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
                  Performance
                </p>

                <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                  产品性能
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InfoBlock
                  title="国标吸收性测试"
                  description="吸收速度、回渗等测试结果。"
                  content={product.performanceGbAbsorbency}
                />
              </div>
            </section>

            <section>
              <div className="mb-5">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
                  Marketing Claims
                </p>

                <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                  产品宣传
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InfoBlock
                  title="核心卖点"
                  content={product.marketingCoreSellingPoint}
                />

                <InfoBlock
                  title="吸收性能"
                  content={product.marketingAbsorbency}
                />

                <InfoBlock
                  title="防漏性能"
                  content={product.marketingLeakProtection}
                />

                <InfoBlock
                  title="亲肤舒适"
                  content={product.marketingSkinComfort}
                />

                <InfoBlock
                  title="贴合防磨"
                  content={product.marketingFitAntiChafe}
                />

                <InfoBlock
                  title="外观设计"
                  content={product.marketingAppearanceDesign}
                />
              </div>
            </section>

            <section>
              <div className="mb-5">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
                  Rating
                </p>

                <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                  产品评级
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <InfoBlock
                  title="消费者反馈"
                  content={product.ratingConsumerFeedback}
                />

                <InfoBlock
                  title="市场表现"
                  content={product.ratingMarketPerformance}
                />

                <InfoBlock
                  title="成本评级"
                  content={product.ratingCostRating}
                />
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}