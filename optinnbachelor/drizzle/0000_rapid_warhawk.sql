CREATE TABLE "Arbeidsledighet" (
	"arbeidsledighet_id" serial PRIMARY KEY NOT NULL,
	"kommune_id" integer NOT NULL,
	"år" integer NOT NULL,
	"antall_arbeidsledighet" integer NOT NULL,
	"antall_menn" integer NOT NULL,
	"antall_kvinner" integer NOT NULL,
	"aldersfordeling" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Bedrift" (
	"bedrift_id" serial PRIMARY KEY NOT NULL,
	"kommune_id" integer NOT NULL,
	"år" integer NOT NULL,
	"antall_bedrift" integer NOT NULL,
	"fordeling" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Befolkning" (
	"befolkning_id" serial PRIMARY KEY NOT NULL,
	"kommune_id" integer NOT NULL,
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
ALTER TABLE "Arbeidsledighet" ADD CONSTRAINT "Arbeidsledighet_kommune_id_Kommune_kommuneId_fk" FOREIGN KEY ("kommune_id") REFERENCES "public"."Kommune"("kommuneId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Bedrift" ADD CONSTRAINT "Bedrift_kommune_id_Kommune_kommuneId_fk" FOREIGN KEY ("kommune_id") REFERENCES "public"."Kommune"("kommuneId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Befolkning" ADD CONSTRAINT "Befolkning_kommune_id_Kommune_kommuneId_fk" FOREIGN KEY ("kommune_id") REFERENCES "public"."Kommune"("kommuneId") ON DELETE cascade ON UPDATE no action;