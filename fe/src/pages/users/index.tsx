import { useEffect } from 'react';
import { useNavStore } from '../../hooks/useNavStore';
import CardItem from '../../components/CardItem';

const cardItems = [
  {
    title: 'Thêm người dùng',
    description: 'Thêm người dùng mới vào hệ thống',
    image: 'https://cdn-icons-png.flaticon.com/512/9194/9194865.png ',
    link: '/users/add',
    backgroundColor: '#fff7ff',
  },
  {
    title: 'Danh sách người dùng',
    description: 'Xem danh sách người dùng trong hệ thống',
    image: 'https://cdn-icons-png.flaticon.com/512/6233/6233829.png ',
    link: '/users/list',
    backgroundColor: '#fff7ff',
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
