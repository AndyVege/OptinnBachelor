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
ALTER TABLE "Arbeidsledighet" ADD CONSTRAINT "Arbeidsledighet_kommuneId_Kommune_kommuneId_fk" FOREIGN KEY ("kommuneId") REFERENCES "public"."Kommune"("kommuneId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Bedrift" ADD CONSTRAINT "Bedrift_kommuneId_Kommune_kommuneId_fk" FOREIGN KEY ("kommuneId") REFERENCES "public"."Kommune"("kommuneId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Befolkning" ADD CONSTRAINT "Befolkning_kommuneId_Kommune_kommuneId_fk" FOREIGN KEY ("kommuneId") REFERENCES "public"."Kommune"("kommuneId") ON DELETE cascade ON UPDATE no action;