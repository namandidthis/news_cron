CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"delivery_time" text NOT NULL,
	"preferred_language" text DEFAULT 'English' NOT NULL,
	"categories" text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
