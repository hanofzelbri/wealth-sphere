-- CreateTable
CREATE TABLE "storages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL DEFAULT (current_setting('app.current_user_id'::text))::uuid,
    "investmentId" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stakings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL DEFAULT (current_setting('app.current_user_id'::text))::uuid,
    "investmentId" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "websiteLink" TEXT NOT NULL,
    "coolDownPeriod" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stakings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "storages" ADD CONSTRAINT "storages_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "investments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storages" ADD CONSTRAINT "storages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stakings" ADD CONSTRAINT "stakings_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "investments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stakings" ADD CONSTRAINT "stakings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable Row Level Security
ALTER TABLE "storages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "stakings" ENABLE ROW LEVEL SECURITY;

-- Force Row Level Security for table owners
ALTER TABLE "storages" FORCE ROW LEVEL SECURITY;
ALTER TABLE "stakings" FORCE ROW LEVEL SECURITY;

-- Create row security policies
CREATE POLICY tenant_isolation_policy ON "storages" USING ("userId" = current_setting('app.current_user_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "stakings" USING ("userId" = current_setting('app.current_user_id', TRUE)::uuid);

-- Create policies to bypass RLS (optional)
CREATE POLICY bypass_rls_policy ON "storages" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "stakings" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
