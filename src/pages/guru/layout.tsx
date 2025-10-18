import { AppSidebar } from "./components/app-sidebar";
import { SiteHeader } from "./components/site-header";

import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { Outlet } from "react-router";
import { useProfile } from "./assesment/service";

export default function LayoutGuru() {

  const {isFetching, data} = useProfile()

  console.log("qeu", data)

  if(isFetching){
    return <div>Loading</div>
  }
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={data!} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col overflow-hidden ">
          <div className="@container/main flex flex-1 flex-col gap-2 overflow-hidden ">
            <div className=" overflow-hidden flex px-0 lg:px-5 pt-5 flex-col gap-4 py-4 md:gap-6 bg-gray-50 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
