CREATE SCHEMA "auth";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "permission" AS ENUM('create:customer', 'read:customer', 'update:customer', 'delete:customer', 'create:employee', 'read:employee', 'update:employee', 'delete:employee', 'create:business', 'read:business', 'update:business', 'delete:business', 'create:job', 'read:job', 'update:job', 'delete:job', 'accept:job', 'reject:job');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('MOVING_CUSTOMER', 'MOVING_CUSTOMER_VIEWER', 'MOVING_BUSINESS_EMPLOYEE', 'MOVING_BUSINESS_ADMIN', 'SUPER_USER');
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
