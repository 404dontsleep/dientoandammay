import { useEffect } from 'react';
import { useNavStore } from '../hooks/useNavStore';
import CardItem from '../components/CardItem';

export default function Home() {
  const { setName } = useNavStore();
  useEffect(() => {
    setName('Library Management');
  }, []);
  return (
    <section className="flex flex-col mx-auto container">
      <div className="grid grid-cols-1 gap-4">
        <CardItem
          title="Quản lý người dùng"
          description="Thêm, sửa, xóa và quản lý thông tin người dùng trong hệ thống thư viện"
          image="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          link="/users"
          backgroundColor="#fff7ff"
        />
        <CardItem
          title="Quản lý sách"
          description="Thêm, sửa, xóa và quản lý thông tin sách trong hệ thống thư viện"
          image="/book-stack.png"
          link="/books"
          backgroundColor="#fff7ff"
        />
        <CardItem
          title="Quản lý phiếu mượn"
          description="Thêm, sửa, xóa và quản lý thông tin phiếu mượn trong hệ thống thư viện"
          image="/literacy.png "
          link="/borrows"
          backgroundColor="#fff7ff"
        />
        <CardItem
          title="Thống kê"
          description="Thống kê số lượng mượn/trả sách, sách được mượn nhiều nhất, người dùng mượn nhiều nhất"
          image="https://cdn-icons-png.flaticon.com/512/921/921591.png "
          link="/stats"
          backgroundColor="#fff7ff"
        />
      </div>
    </section>
  );
}
