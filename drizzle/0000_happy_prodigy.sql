CREATE TABLE "news" (
	"guid" text PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"link" text NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
