"use client";

import AdminSectionPage from "@/components/AdminSectionPage";
import BlogsManager from "@/components/blogs/BlogsManager";

export default function AdminBlogsPage() {
  return (
    <AdminSectionPage title="Blogs" description="Plumber Finder's own articles: write, schedule, add FAQs, and answer readers' comments.">
      <BlogsManager />
    </AdminSectionPage>
  );
}
