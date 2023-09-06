ALTER TABLE "auth"."roles_permissions" DROP CONSTRAINT "roles_permissions_role_id_roles_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth"."roles_permissions" ADD CONSTRAINT "roles_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "auth"."roles"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
