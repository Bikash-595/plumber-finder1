import fs from "node:fs";
import path from "node:path";

const plumbersPath = path.join(process.cwd(), "app/data/plumbers.ts");

const generateBlogs = (ownerName) => {
  const titles = [
    "How to Prevent Frozen Pipes",
    "Signs You Need a New Water Heater",
    "Emergency Plumbing: What to Do",
    "Benefits of Trenchless Sewer Repair",
    "Hydro Jetting vs. Snaking",
    "Water Heater Maintenance Tips",
    "Why Regular Drain Cleaning Matters",
    "How to Choose a Reliable Plumber",
  ];

  const slugs = titles.map((title) => title.toLowerCase().replace(/\s/g, "-"));
  const images = [
    "/Plumber working under a modern sink.png",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
    "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800",
  ];
  const videos = [null, "https://www.youtube.com/embed/dQw4w9WgXcQ", "https://www.youtube.com/embed/9bZkp7q19f0"];
  const dates = ["2024-01-15", "2024-02-10", "2024-03-05"];
  const postCount = 2 + (ownerName.length % 2);

  return Array.from({ length: postCount }, (_, index) => ({
    slug: slugs[index],
    title: titles[index],
    summary: `Read our latest article about ${titles[index].toLowerCase()}.`,
    content: `<p>Full content for ${titles[index]} goes here.</p>`,
    image: images[index % images.length],
    video: videos[index % videos.length],
    author: ownerName,
    date: dates[index % dates.length],
    readTime: 3 + (index % 6),
    readCount: 50 + index * 25,
    reactions: { like: 10 + index * 3, love: 5 + index * 2, helpful: 8 + index * 4 },
    comments: [],
  }));
};

if (fs.existsSync(plumbersPath)) {
  console.log(`Found plumbers data at ${plumbersPath}.`);
  console.log("This helper is intentionally non-destructive; generate content in app/data/plumbers.ts manually or extend the script for your workflow.");
  console.log(`Example posts for Sarah Johnson: ${JSON.stringify(generateBlogs("Sarah Johnson"), null, 2)}`);
} else {
  console.log("Could not find app/data/plumbers.ts");
}
