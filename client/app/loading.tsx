import Loader from "@/app/components/Loader/Loader";

export default function Loading() {

  return (
    <div className="flex h-screen w-full items-center justify-center bg-transparent">
      <Loader />
    </div>
  );
}