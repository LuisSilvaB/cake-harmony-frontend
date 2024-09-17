
import { Suspense } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function ProductsStoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex w-full flex-1 flex-row items-center justify-center rounded-lg bg-white">
          <AiOutlineLoading3Quarters className="text-atomic-900 h-16 w-16 animate-spin text-6xl text-gray-400" />
        </div>
      }
    >
      <section className="flex w-full flex-col flex-1 gap-2 rounded-lg bg-white px-1 ">
        {children}
      </section>
    </Suspense>
  );
}