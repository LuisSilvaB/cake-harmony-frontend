import Navbar from './components/ui/navbar';
import Sidebar from './components/ui/sidebar'
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full flex flex-1 flex-row">
      <Sidebar />
      <div className='w-full flex-1 flex-col'>
        <Navbar />
        {children}
      </div>
    </section>
  );
}