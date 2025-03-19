CREATE TABLE "forecasts" (
	"id" serial PRIMARY KEY NOT NULL,
	"location_id" integer NOT NULL,
	"time" timestamp NOT NULL,
	"temperature" numeric,
	"wind_speed" numeric,
	"precipitation" numeric,
	"weather_symbol" text
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"latitude" numeric NOT NULL,
	"longitude" numeric NOT NULL,
	CONSTRAINT "locations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "forecasts" ADD CONSTRAINT "forecasts_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;