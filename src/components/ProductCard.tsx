import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatWeight } from "@/utils/productDisplay";

type ProductCardProps = {
  product: Product;
};

function TierBadge({ tier }: { tier: string }) {
  const tierLabelMap: Record<string, string> = {
    SP: "Super Premium",
    P: "Premium",
    V: "Value",
    E: "Entry",
  };

  return (
    <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white shadow-sm">
      {tierLabelMap[tier] || tier}
    </span>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const productTitle = `${product.brand} ${product.series} ${product.size}`;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-square bg-neutral-50">
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-800 shadow-sm backdrop-blur">
            {product.form}
          </span>

          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-800 shadow-sm backdrop-blur">
            {product.size}
          </span>

          <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {product.tier}
          </span>
        </div>

        <Image
          src={product.image}
          alt={`${productTitle} 产品图片`}
          fill
          className="object-contain p-7 transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="p-5">
        <div className="mb-4">
          <p className="text-sm font-medium text-neutral-500">
            {product.brand}
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">
            {product.series} {product.size}
          </h2>

          <p className="mt-2 line-clamp-1 text-sm font-medium text-neutral-500">
            {product.versionName}
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
            {product.form}
          </span>

          <TierBadge tier={product.tier} />

          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
            {product.generation}
          </span>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-neutral-100 p-3">
            <p className="text-[11px] font-medium text-neutral-500">价格</p>
            <p className="mt-1 text-sm font-semibold text-neutral-950">
              ¥{product.price}
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-100 p-3">
            <p className="text-[11px] font-medium text-neutral-500">重量</p>
            <p className="mt-1 text-sm font-semibold text-neutral-950">
              {formatWeight(product.weight)}
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-100 p-3">
            <p className="text-[11px] font-medium text-neutral-500">上市</p>
            <p className="mt-1 text-sm font-semibold text-neutral-950">
              {product.launchTime}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Key Claim
          </p>

          <p className="line-clamp-2 text-sm leading-6 text-neutral-700">
            {product.claim1}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm font-medium text-neutral-500">
            ¥{product.price} / 片
          </p>

          <span className="text-sm font-medium text-neutral-950 transition group-hover:translate-x-1">
            查看详情 →
          </span>
        </div>
      </div>
    </Link>
  );
}