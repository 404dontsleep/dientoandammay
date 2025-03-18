import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
export default function MainLayout() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Outlet />
    </div>
  );
}
