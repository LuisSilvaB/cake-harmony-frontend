export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full flex flex-1 flex-row">
        {children}
    </section>
  );
}