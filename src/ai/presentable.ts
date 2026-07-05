import dotenv from "dotenv";
import { newsTable } from "../schema.ts";
import { db } from "../db.ts";
import { inArray, gte, and } from "drizzle-orm";

dotenv.config();

export async function getFeeds(userPref: string[]): Promise<any> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return db.select()
    .from(newsTable)
    .where(
      and(
        inArray(newsTable.category, userPref),
        gte(newsTable.publishedAt, since)
      )
    );
}



export async function aiSummary(articles: { title: string; description: string; category: string }[]): Promise<any>{

  const articleText = articles.map((a,i)=> `${i + 1}. [${a.category}] ${a.title} — ${a.description}`).join("\n");


  const summary = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
    messages: [
      {
        role: 'user',
        content: `You are a news anchor preparing a daily audio digest. Summarize the following news articles into a natural, conversational script of max 200 words for 1 news , for each news atleast yap good. Do not assume anything beyond what is written. Stay factual.\n\n${articleText}`
      },
    ],
  }),
});
const data:any = await summary.json();
return data.choices[0].message.content;

} 

