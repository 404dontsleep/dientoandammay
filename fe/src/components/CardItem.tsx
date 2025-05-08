import { Card } from 'antd';
import { Link } from 'react-router-dom';

export default function CardItem({
  title,
  description,
  image,
  link,
  backgroundColor,
}: {
  title: string;
  description: string;
  image: string;
  link: string;
  backgroundColor: string;
}) {
  return (
    <Link to={link}>
      <Card
        className="hover:shadow-lg transition-all flex flex-row"
        style={{ backgroundColor: backgroundColor }}
      >
        <div className="flex flex-row">
          <img
            src={image}
            alt={title}
            className="p-4 mx-auto w-32 float-left mr-4"
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-bold text-blue-700">{title}</h2>
            <p className="my-3 text-gray-600">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
