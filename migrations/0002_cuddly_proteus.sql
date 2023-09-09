CREATE SCHEMA "entity";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity"."organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"persisted_at" timestamp DEFAULT now() at time zone 'utc' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity"."user" (
	"uid" varchar(128) PRIMARY KEY NOT NULL,
	"role_id" uuid NOT NULL,
	"organization_id" uuid,
	"persisted_at" timestamp DEFAULT now() at time zone 'utc' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity"."user" ADD CONSTRAINT "user_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "entity"."roles"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entity"."user" ADD CONSTRAINT "user_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "entity"."organization"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
