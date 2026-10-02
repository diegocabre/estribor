import { blogPosts, getPostBySlug } from "@/lib/content/blog";
import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Artículo del blog de Estribor Consultores";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return renderOgImage({
    eyebrow: post ? `Blog · ${post.category}` : "Blog",
    title: post?.title ?? "Estribor Consultores",
  });
}
