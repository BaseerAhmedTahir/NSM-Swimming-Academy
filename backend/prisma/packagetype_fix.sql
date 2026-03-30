-- Safe migration: convert packageType from enum to TEXT without data loss
-- PostgreSQL allows direct USING cast from enum to text

ALTER TABLE "Student" ALTER COLUMN "packageType" TYPE TEXT USING "packageType"::text;
ALTER TABLE "MembershipHistory" ALTER COLUMN "packageType" TYPE TEXT USING "packageType"::text;
ALTER TABLE "Payment" ALTER COLUMN "packageType" TYPE TEXT USING "packageType"::text;
DROP TYPE IF EXISTS "PackageType";
