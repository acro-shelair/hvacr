import { getTableStats, testDbConnection } from "./actions";
import MaintenanceClient from "./MaintenanceClient";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const [stats, dbStatus] = await Promise.all([
    getTableStats(),
    testDbConnection(),
  ]);

  return <MaintenanceClient stats={stats} dbStatus={dbStatus} />;
}
