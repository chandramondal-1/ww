import { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";

import { products as seedProducts } from "@/data/catalog";
import { ProductDetailClient } from "@/components/product-detail-client";
import { getProductBySlug, getRelatedProducts } from "@/lib/store";

type ProductPageProps = {
  params: Promise<{
    categorySlug: string;
    productSlug: string;
  }>;
};

export async function generateStaticParams() {
  return seedProducts.map((product) => ({
    categorySlug: product.categorySlug,
    productSlug: product.slug
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;
  const product = await getProductBySlug(categorySlug, productSlug);

  if (!product) {
    return {};
  }

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      images: [product.primaryImage]
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { categorySlug, productSlug } = await params;
  const product = await getProductBySlug(categorySlug, productSlug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.seoDescription,
    image: product.images,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "SUN SEATINGS"
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock"
    }
  };

  return (
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
