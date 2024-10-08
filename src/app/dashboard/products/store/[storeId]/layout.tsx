
import { Suspense } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function GlobalProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex w-full flex-1 flex-row items-center justify-center rounded-lg bg-white">
          <AiOutlineLoading3Quarters className="text-atomic-900 h-16 w-16 animate-spin text-6xl text-gray-400" />
        </div>
      }
    >
      <section className="flex flex-col w-full flex-1 rounded-lg bg-white p-1 ">
        {children}
      </section>
    </Suspense>
  );
}