import { useEffect } from 'react';
import { useNavStore } from '../../hooks/useNavStore';
import CardItem from '../../components/CardItem';

const cardItems = [
  {
    title: 'Add book',
    description: 'Add book to library',
    image: 'https://cdn-icons-png.flaticon.com/512/188/188032.png',
    link: '/books/add',
    backgroundColor: '#f0f7ff',
  },
  {
    title: 'List books',
    description: 'List books from library',
    image: 'https://cdn-icons-png.flaticon.com/512/188/188032.png',
    link: '/books/list',
    backgroundColor: '#f0f7ff',
  },
];

export default function Books() {
  const { setName } = useNavStore();
  useEffect(() => {
    setName('Books management');
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
