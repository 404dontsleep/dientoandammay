import { useEffect } from 'react';
import { useNavStore } from '../../hooks/useNavStore';
import CardItem from '../../components/CardItem';

const cardItems = [
  {
    title: 'Mượn sách',
    description: 'Tạo phiếu mượn sách',
    image: '/literacy.png',
    link: '/borrows/add',
    backgroundColor: '#fff7ff',
  },
  {
    title: 'Danh sách mượn sách',
    description: 'Xem danh sách các phiếu mượn sách',
    image: 'https://cdn-icons-png.flaticon.com/512/2417/2417791.png ',
    link: '/borrows/list',
    backgroundColor: '#fff7ff',
  },
];

export default function Borrows() {
  const { setName } = useNavStore();
  useEffect(() => {
    setName('Quản lý mượn sách');
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
