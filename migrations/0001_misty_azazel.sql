CREATE SCHEMA "auth";
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
