import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
interface protectedProps {
  children: React.ReactNode;
}
export default function Protected({ children }: protectedProps) {
  const user = useSelector((state: any) => state.user);

  const isAdmin = user?.role === "admin";

  return isAdmin ? children : redirect("/");
}
