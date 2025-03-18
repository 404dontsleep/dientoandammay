import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <div className="flex gap-4 p-4 bg-gray-100">
      <Link
        to="/"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Trang chủ
      </Link>
      <Link
        to="/create"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Thêm sách
      </Link>
    </div>
  );
}
