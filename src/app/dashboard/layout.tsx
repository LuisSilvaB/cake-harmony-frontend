import PermissionsLoader from "../auth/user/components/ui/permissions-loader";
import Navbar from './components/ui/navbar';
import Sidebar from './components/ui/sidebar'
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex w-full flex-1 flex-row">
      <Sidebar />
      <div className="flex w-full max-w-[calc(100%-190px)] flex-1 flex-col">
        <PermissionsLoader />
        <Navbar />
        <div className="flex w-full flex-1 flex-col p-2">{children}</div>
      </div>
    </section>
  );
}