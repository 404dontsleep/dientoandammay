import { useEffect } from 'react';
import { useNavStore } from '../../hooks/useNavStore';
import CardItem from '../../components/CardItem';

const cardItems = [
  {
    title: 'Thêm người dùng',
    description: 'Thêm người dùng mới vào hệ thống',
    image: 'https://cdn-icons-png.flaticon.com/512/188/188032.png',
    link: '/users/add',
    backgroundColor: '#f0f7ff',
  },
  {
    title: 'Danh sách người dùng',
    description: 'Xem danh sách người dùng trong hệ thống',
    image: 'https://cdn-icons-png.flaticon.com/512/188/188032.png',
    link: '/users/list',
    backgroundColor: '#f0f7ff',
  },
];

export default function Users() {
  const { setName } = useNavStore();
  useEffect(() => {
    setName('Quản lý người dùng');
  }, []);
  return (
    <section className="flex flex-col mx-auto container">
      <div className="grid grid-cols-1 gap-4">
        {cardItems.map((item) => (
          <CardItem
            key={item.title}
            {...item}
          />
        ))}
      </div>
    </section>
  );
}
