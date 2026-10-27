import AdminSidebar from "@/app/components/admin/AdminSidebar";
import Header from "@/app/components/admin/Dashboard/header";
import Quick from "@/app/components/admin/Dashboard/Quick";
import RecentOrder from "@/app/components/admin/Dashboard/recentorder";
import Sales from "@/app/components/admin/Dashboard/sales";
import Stats from "@/app/components/admin/Dashboard/stats";
import TopProducts from "@/app/components/admin/Dashboard/topProducts";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#29231F]">
      {/* Fixed Sidebar (w-16 on mobile, w-64 on desktop) */}
      <AdminSidebar />

      {/* 
        FIXED:
        1. Changed `ml-64` to `ml-16 md:ml-64` to match the dynamic sidebar width.
        2. Added `pb-28 md:pb-8` so content isn't covered by the mobile bottom bar.
      */}
      <main className="ml-16 md:ml-64 min-w-0 p-4 sm:p-6 lg:p-8 pb-28 md:pb-8 transition-all duration-300">
        <div className="mx-auto max-w-[1600px] space-y-7">
          <Header />
          <Stats />
          <Sales />

          <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[1.6fr_1fr]">
            <RecentOrder />
            <TopProducts />
          </div>

          <Quick />
        </div>
      </main>
    </div>
  );
}