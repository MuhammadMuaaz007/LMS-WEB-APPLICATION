import Loader from "@/app/components/Loader/Loader";

export default function Loading() {
  // You can wrap it in a container if you need specific styling
  return (
    <div className="flex h-screen w-full items-center justify-center bg-transparent">
      <Loader />
    </div>
  );
}