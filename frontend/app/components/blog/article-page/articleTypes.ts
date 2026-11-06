import type { usePlumber } from "@/components/plumber/usePlumber";
import type { useBlogViews } from "@/components/blog/useBlogViews";
import type { buildArticleMarkup, getCategory } from "./articleMarkup";

// Shapes shared by the article page's sections.
export type ArticlePlumber = NonNullable<ReturnType<typeof usePlumber>>;
export type ArticlePost = NonNullable<ArticlePlumber["blogs"]>[number];
export type ArticleMarkup = ReturnType<typeof buildArticleMarkup>;
export type ArticleCategory = ReturnType<typeof getCategory>;
export type ArticleViews = ReturnType<typeof useBlogViews>;
export type RelatedPost = { plumberId: string; href: string; post: ArticlePost };
export type ShareLinks = { twitter: string; facebook: string; linkedin: string };
