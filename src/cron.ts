import cron from "node-cron";
import { XMLParser } from "fast-xml-parser";
import { newsTable } from "./schema.ts";
import {db }from "./db.ts"


const FEEDS = {
  companies: "https://www.livemint.com/rss/companies",
  opinion: "https://www.livemint.com/rss/opinion",
  money: "https://www.livemint.com/rss/money",
  politics: "https://www.livemint.com/rss/politics",
  science: "https://www.livemint.com/rss/science",
  industry: "https://www.livemint.com/rss/industry",
  education: "https://www.livemint.com/rss/education",
  sports: "https://www.livemint.com/rss/sports",
  technology: "https://www.livemint.com/rss/technology",
  news: "https://www.livemint.com/rss/news",
  markets: "https://www.livemint.com/rss/markets",
  ai: "https://www.livemint.com/rss/AI",
  insurance: "https://www.livemint.com/rss/insurance",
  budget: "https://www.livemint.com/rss/budget",
  elections: "https://www.livemint.com/rss/elections",
  videos: "https://www.livemint.com/rss/videos",
} as const;

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
});

interface RSSArticle {
  category: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
}

async function fetchFeed(
  category: string,
  url: string
): Promise<RSSArticle[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${category}: ${response.status}`);
  }

  const xml = await response.text();
  const data = parser.parse(xml);

  const items = Array.isArray(data.rss.channel.item)
    ? data.rss.channel.item
    : [data.rss.channel.item];

  return items.map((article: any) => ({
    category,
    title: article.title,
    link: article.link,
    description: article.description,
    pubDate: article.pubDate,
    guid: article.guid,
  }));
}

async function fetchAllFeeds() {
  const allFeeds = await Promise.all(
    Object.entries(FEEDS).map(([category, url]) =>
      fetchFeed(category, url)
    )
  );

  return allFeeds.flat();
}


async function syncNews(){
  let inserted =0;
  let skipped =0;

  const articles = await fetchAllFeeds();
  for (const article of articles){
    const result = await db.insert(newsTable).values({
      guid: String(article.guid),
      source: "livemint",
      category: article.category,
      title: article.title,
      description: article.description ?? null,
      link: article.link,
      publishedAt: article.pubDate ? new Date(article.pubDate) : null,
    }).onConflictDoNothing().returning({ guid: newsTable.guid });
    
    if(result.length===0){
      skipped++;
    }
    else{
      inserted++;
    }
  }
  console.log(`Done — inserted: ${inserted}, skipped (duplicates): ${skipped}`)
}


syncNews();

cron.schedule("0 * * * *", () => {
  syncNews();
});
