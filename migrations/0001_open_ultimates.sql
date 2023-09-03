CREATE SCHEMA "auth";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('MOVING_CUSTOMER', 'MOVING_CUSTOMER_VIEWER', 'MOVING_BUSINESS_EMPLOYEE', 'MOVING_BUSINESS_ADMIN', 'SUPER_USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" "role" NOT NULL,
	CONSTRAINT "role_role_unique" UNIQUE("role")
);
