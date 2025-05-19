CREATE TABLE "riskLevels" (
	"id" text PRIMARY KEY NOT NULL,
	"location" text NOT NULL,
	"risk_type" text NOT NULL,
	"level" integer NOT NULL,
	"valid_from" timestamp with time zone NOT NULL,
	"valid_to" timestamp with time zone NOT NULL
);