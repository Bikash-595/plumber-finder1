import { type BlogFaq, type PlatformBlog } from "@/lib/adminApi";

export { FRONTEND_URL } from "@/lib/siteUrls";

export const categories = ["Maintenance tips", "Emergency advice", "Cost guides", "Water heaters", "Drains & sewer", "Hiring a plumber", "Plumber Finder news"];

export const statuses = [{ value: "all", label: "All" }, { value: "published", label: "Published" }, { value: "draft", label: "Drafts" }];

export const field = "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";

export type Draft = { title: string; category: string; author: string; publishDate: string; tags: string; coverImage: string; excerpt: string; content: string; faqs: BlogFaq[] };

export const blank: Draft = { title: "", category: categories[0], author: "Plumber Finder Team", publishDate: "", tags: "", coverImage: "", excerpt: "", content: "", faqs: [] };

export const today = () => new Date().toISOString().slice(0, 10);

/** Shrinks a chosen photo to a WebP data URL (max 1600px). */
export function readPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const data = canvas.toDataURL("image/webp", 0.8);
      if (data.length > 1_200_000) reject(new Error("That photo is too large. Choose a smaller one."));
      else resolve(data);
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That file isn't a photo we can read.")); };
    image.src = url;
  });
}

export const stateOf = (post: PlatformBlog) => (post.status === "draft" ? { value: "pending", label: "Draft" } : post.publishDate && post.publishDate.slice(0, 10) > today() ? { value: "scheduled", label: `Scheduled ${post.publishDate.slice(0, 10)}` } : { value: "completed", label: "Published" });

export const typeLabels = { platform: "Plumber Finder", company: "Companies", freelancer: "Freelancers", demo: "Sample posts" } as const;
