import { useEffect } from 'react';
import { useNavStore } from '../../hooks/useNavStore';
import CardItem from '../../components/CardItem';

const cardItems = [
  {
    title: 'Thêm sách',
    description: 'Thêm sách vào thư viện',
    image: 'https://cdn-icons-png.flaticon.com/512/4693/4693731.png ',
    link: '/books/add',
    backgroundColor: '#fff7ff',
  },
  {
    title: 'Danh sách sách',
    description: 'Danh sách sách từ thư viện',
    image: '/books.png',
    link: '/books/list',
    backgroundColor: '#fff7ff',
  },
];

export default function Books() {
  const { setName } = useNavStore();
  useEffect(() => {
    setName('Quản lý sách');
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
