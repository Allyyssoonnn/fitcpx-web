import AppMarketingDash from "./dashboard/AppMarketing.dash";
import MenuBar from "./dashboard/menuBart.dash";
import OverviewDash from "./dashboard/overview.dash";

function Dashboard() {
   return (
      <div className="container-fluid">
         <div className="flex lg:justify-start justify-center">
            <MenuBar />
         </div>

         <AppMarketingDash />

         <div className="flex gap-3 mb-3">
            {/* <DuePaymentsDash />

            <Alert>
               <InfoIcon />
               <AlertTitle>Contratos Expirando</AlertTitle>
               <AlertDescription>0</AlertDescription>
            </Alert> */}
         </div>

         <OverviewDash />

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="flex flex-col lg:col-span-2 gap-4">
               {/* {visibleFields.online && <OnlineSellDash />} */}
               {/* {visibleFields.tours && <TourDash />} */}
            </div>

            {/* <div className="flex flex-col lg:col-span-2 gap-4">
               {visibleFields.duepayments && <DuePaymentsDash />}
               {visibleFields.physical && <OlderPhysicalDash />}
            </div> */}
         </div>
      </div>
   );
}

export default Dashboard;
