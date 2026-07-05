import cron from "node-cron";
import dotenv from "dotenv";
import { db } from "./db.ts";
import { userTable } from "./schema.ts";
import { generateDigest } from "./ai/digest.ts";
import { eq } from "drizzle-orm";
dotenv.config();


let scheduledUsers : { id: string; email: string; deliveryTime: string }[] = [];

async function loadUsers() {
  scheduledUsers = await db.select({
    id: userTable.id,
    email: userTable.email,
    deliveryTime: userTable.deliveryTime,
  }).from(userTable);

  console.log(`Loaded ${scheduledUsers.length} users into memory`);
}

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, "0");
  const mm = now.getMinutes().toString().padStart(2, "0");
  const currentTime = `${hh}:${mm}`; // "08:00", "14:35"

  const matched = scheduledUsers.filter(u => u.deliveryTime === currentTime);

  for (const user of matched) {
    console.log(`Triggering digest for ${user.email}`);

    // fetch their preferences fresh from DB
    const fullUser = await db.select()
      .from(userTable)
      .where(eq(userTable.id, user.id));
      const found = fullUser[0];
if (!found) return;

await generateDigest(found.categories, found.email);
  }
});

cron.schedule("0 0 * * *", loadUsers);

// load on startup
loadUsers();