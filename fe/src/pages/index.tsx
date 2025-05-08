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
          backgroundColor="#f0f7ff"
        />
        <CardItem
          title="Quản lý sách"
          description="Thêm, sửa, xóa và quản lý thông tin sách trong hệ thống thư viện"
          image="https://cdn-icons-png.flaticon.com/512/188/188032.png "
          link="/books"
          backgroundColor="#f0f7ff"
        />
        <CardItem
          title="Quản lý phiếu mượn"
          description="Thêm, sửa, xóa và quản lý thông tin phiếu mượn trong hệ thống thư viện"
          image="https://cdn-icons-png.flaticon.com/512/2918/2918687.png "
          link="/borrow-books"
          backgroundColor="#f0f7ff"
        />
      </div>
    </section>
  );
}
