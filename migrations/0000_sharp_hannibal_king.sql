CREATE SCHEMA "example";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "example"."dummy_post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "example"."dummy_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(256) NOT NULL,
	"last_name" varchar(256) NOT NULL,
	"email" varchar(256),
	CONSTRAINT "dummy_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "example"."dummy_post" ADD CONSTRAINT "dummy_post_user_id_dummy_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "example"."dummy_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
