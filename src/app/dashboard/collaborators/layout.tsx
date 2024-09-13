
import { Suspense } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function CollaboratorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex w-full flex-1 flex-row items-center justify-center rounded-lg bg-white">
          <AiOutlineLoading3Quarters className="text-atomic-900 animate-spin text-6xl w-16 h-16 text-gray-400" />
        </div>
      }
    >
      <section className="flex w-full">{children}</section>
    </Suspense>
  );
}