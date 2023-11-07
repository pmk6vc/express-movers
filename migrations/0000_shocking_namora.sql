CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "entity";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "permission" AS ENUM('create:customer', 'read:customer', 'update:customer', 'delete:customer', 'create:employee', 'read:employee', 'update:employee', 'delete:employee', 'create:business', 'read:business', 'update:business', 'delete:business', 'create:job', 'read:job', 'update:job', 'delete:job', 'create:bid', 'read:bid', 'update:bid', 'delete:bid', 'accept:bid', 'reject:bid');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('MOVING_CUSTOMER', 'MOVING_BUSINESS_EMPLOYEE', 'MOVING_BUSINESS_ADMIN', 'SUPER_USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"permission" "permission" NOT NULL,
	CONSTRAINT "permissions_permission_unique" UNIQUE("permission")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" "role" NOT NULL,
	CONSTRAINT "roles_role_unique" UNIQUE("role")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."roles_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	CONSTRAINT roles_permissions_role_id_permission_id PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."user_organization_role" (
	"uid" varchar(128) NOT NULL,
	"organization_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT user_organization_role_uid_organization_id_role_id PRIMARY KEY("uid","organization_id","role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity"."organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"persisted_at" timestamp DEFAULT (now() at time zone 'utc') NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entity"."user" (
	"uid" varchar(128) PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"profile" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"persisted_at" timestamp DEFAULT (now() at time zone 'utc') NOT NULL,
	"is_disabled" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."roles_permissions" ADD CONSTRAINT "roles_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "auth"."roles"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."roles_permissions" ADD CONSTRAINT "roles_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "auth"."permissions"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."user_organization_role" ADD CONSTRAINT "user_organization_role_uid_user_uid_fk" FOREIGN KEY ("uid") REFERENCES "entity"."user"("uid") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."user_organization_role" ADD CONSTRAINT "user_organization_role_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "entity"."organization"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."user_organization_role" ADD CONSTRAINT "user_organization_role_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "auth"."roles"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
