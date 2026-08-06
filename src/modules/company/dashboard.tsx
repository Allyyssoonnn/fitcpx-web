import { FitCpxAlunoCard, FitCpxAppCard } from "./dashboard/AppMarketing.dash";
import DuePaymentsDash from "./dashboard/duePayments.dash";
import LastActivitiesDash from "./dashboard/LastActivities.dash";
import OlderPhysicalDash from "./dashboard/olderPhysical.dash";
import { OnlineSellDash } from "./dashboard/OnlineSell.dash";
import OverviewDash from "./dashboard/overview.dash";

function Dashboard() {
   return (
      <div className="container-fluid">
         <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="flex flex-col lg:col-span-3 gap-4">
               <OverviewDash />
               <OnlineSellDash />
               <OlderPhysicalDash />
            </div>

            <div className="flex flex-col lg:col-span-2 gap-4">
               <DuePaymentsDash />
               <LastActivitiesDash />
               <FitCpxAlunoCard />
               <FitCpxAppCard />
            </div>
         </div>
      </div>
   );
}

export default Dashboard;
