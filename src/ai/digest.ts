import dotenv from "dotenv";
import { SarvamAIClient } from "sarvamai";
import fs from "fs";
import { getFeeds } from "./presentable.ts";
import { aiSummary } from "./presentable.ts";
import { v2 as cloudinary } from "cloudinary";
import { Resend } from 'resend';

dotenv.config();

const sarvam = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY,
});


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const resend = new Resend(`${process.env.RESEND_API_KEY}`)

export async function uploadAudio(filePath: string): Promise<string> {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "video", // cloudinary uses "video" for audio files
    folder: "news-digests",
  });

  return result.secure_url; 
}

export async function generateDigest(userPref: string[], userEmail: string) {
  console.log("Fetching articles...");
  const articles = await getFeeds(userPref);
  console.log(`Got ${articles.length} articles`);

  console.log("Generating summary...");
  const summary = await aiSummary(articles);
  console.log("Summary:", summary);

  console.log("Converting to audio...");
  const response = await sarvam.textToSpeech.convert({
    text: summary,
    target_language_code: "en-IN",
    model: "bulbul:v2",
    speaker: "abhilash",
  });
  const audio = Buffer.from(response.audios.join(""), "base64");
  fs.writeFileSync("output.wav", audio);
  console.log("Audio saved");

  console.log("Uploading to Cloudinary...");
  const audioUrl = await uploadAudio("output.wav");
  console.log("Audio URL:", audioUrl);

  console.log("Sending email...");
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: userEmail,
    subject: "Your daily news digest",
    html: `<p>PFA Your Today's News</p><br/><a href="${audioUrl}">Listen to your audio digest</a>`,
  });
  console.log("Email sent to", userEmail);
}
// testing
// await generateDigest(["ai", "technology"], "naman6176@gmail.com");