import cron from "node-cron";
import { XMLParser } from "fast-xml-parser";

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

(async () => {
  const articles = await fetchAllFeeds();

  console.log(`Fetched ${articles.length} articles\n`);
  console.log(articles.slice(0, 5));
})();