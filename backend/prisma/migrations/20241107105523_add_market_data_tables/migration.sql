-- CreateTable
CREATE TABLE "chart_data_hourly" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL DEFAULT (current_setting('app.current_user_id'::text))::uuid,
    "investmentId" UUID NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "chart_data_hourly_pkey" PRIMARY KEY ("id","timestamp")
);

-- CreateTable
CREATE TABLE "chart_data_daily" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL DEFAULT (current_setting('app.current_user_id'::text))::uuid,
    "investmentId" UUID NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "chart_data_daily_pkey" PRIMARY KEY ("id","timestamp")
);

-- AddForeignKey
ALTER TABLE "chart_data_hourly" ADD CONSTRAINT "chart_data_hourly_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "investments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_data_hourly" ADD CONSTRAINT "chart_data_hourly_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_data_daily" ADD CONSTRAINT "chart_data_daily_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "investments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_data_daily" ADD CONSTRAINT "chart_data_daily_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "chart_data_daily_investmentId_timestamp_key" ON "chart_data_daily"("investmentId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "chart_data_hourly_investmentId_timestamp_key" ON "chart_data_hourly"("investmentId", "timestamp");

-- Enable Row Level Security
ALTER TABLE "chart_data_hourly" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chart_data_daily" ENABLE ROW LEVEL SECURITY;

-- Force Row Level Security for table owners
ALTER TABLE "chart_data_hourly" FORCE ROW LEVEL SECURITY;
ALTER TABLE "chart_data_daily" FORCE ROW LEVEL SECURITY;

-- Create row security policies
CREATE POLICY tenant_isolation_policy ON "chart_data_hourly" USING ("userId" = current_setting('app.current_user_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "chart_data_daily" USING ("userId" = current_setting('app.current_user_id', TRUE)::uuid);

-- Create policies to bypass RLS (optional)
CREATE POLICY bypass_rls_policy ON "chart_data_hourly" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "chart_data_daily" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');

-- Create hypertables
SELECT create_hypertable('chart_data_hourly', 'timestamp');
SELECT create_hypertable('chart_data_daily', 'timestamp');
