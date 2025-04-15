CREATE TABLE "weather_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"temperature" integer,
	"wind_speed" integer NOT NULL,
	"condition" text
);
--> statement-breakpoint
DROP TABLE "account" CASCADE;--> statement-breakpoint
DROP TABLE "user" CASCADE;