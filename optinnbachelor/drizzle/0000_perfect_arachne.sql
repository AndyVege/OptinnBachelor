CREATE TABLE "befolkning" (
	"id" serial PRIMARY KEY NOT NULL,
	"postNr" text NOT NULL,
	"år" integer NOT NULL,
	"antall" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kommune" (
	"postNr" text PRIMARY KEY NOT NULL,
	"kommune" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "befolkning" ADD CONSTRAINT "befolkning_postNr_kommune_postNr_fk" FOREIGN KEY ("postNr") REFERENCES "public"."kommune"("postNr") ON DELETE cascade ON UPDATE no action;