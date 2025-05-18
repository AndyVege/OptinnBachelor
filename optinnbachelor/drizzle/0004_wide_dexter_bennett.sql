CREATE TABLE "Arbeidsledighet" (
	"arbeidsledighet_id" integer PRIMARY KEY NOT NULL,
	"kommuneId" varchar NOT NULL,
	"år" integer NOT NULL,
	"antallArbeidsledighet" integer NOT NULL,
	"antallMenn" integer NOT NULL,
	"antallKvinner" integer NOT NULL,
	"aldersfordeling" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Bedrift" (
	"bedriftId" integer PRIMARY KEY NOT NULL,
	"kommuneId" varchar NOT NULL,
	"år" integer NOT NULL,
	"antallBedrifter" integer NOT NULL,
	"fordeling" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Befolkning" (
	"befolkning_id" integer PRIMARY KEY NOT NULL,
	"kommuneId" varchar NOT NULL,
	"år" integer NOT NULL,
	"antall_befolkning" integer NOT NULL,
	"født" integer NOT NULL,
	"døde" integer NOT NULL,
	"aldersfordeling" jsonb
);
--> statement-breakpoint
CREATE TABLE "Kommune" (
	"kommuneId" varchar PRIMARY KEY NOT NULL,
	"kommunenavn" varchar NOT NULL
);
--> statement-breakpoint
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
ALTER TABLE "weather_data" RENAME COLUMN "windSpeed" TO "wind_speed";--> statement-breakpoint
ALTER TABLE "weather_data" ALTER COLUMN "temperature" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "weather_data" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "Arbeidsledighet" ADD CONSTRAINT "Arbeidsledighet_kommuneId_Kommune_kommuneId_fk" FOREIGN KEY ("kommuneId") REFERENCES "public"."Kommune"("kommuneId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Bedrift" ADD CONSTRAINT "Bedrift_kommuneId_Kommune_kommuneId_fk" FOREIGN KEY ("kommuneId") REFERENCES "public"."Kommune"("kommuneId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Befolkning" ADD CONSTRAINT "Befolkning_kommuneId_Kommune_kommuneId_fk" FOREIGN KEY ("kommuneId") REFERENCES "public"."Kommune"("kommuneId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forecasts" ADD CONSTRAINT "forecasts_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weather_data" DROP COLUMN "condition";--> statement-breakpoint
ALTER TABLE "weather_data" DROP COLUMN "priority";