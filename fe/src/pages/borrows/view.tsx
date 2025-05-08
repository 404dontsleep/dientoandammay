import { Descriptions } from 'antd';
import { useParams } from 'react-router-dom';
import borrowApi from '../../api/borrowApi';
import useSWR from 'swr';
import dayjs from 'dayjs';

export default function ViewBorrow() {
  const { id } = useParams();
  const { data: borrow } = useSWR(`/borrows/${id}`, () => borrowApi.getBorrowById(id || ''));

  if (!borrow) return null;

  return (
    <section className="flex flex-col mx-auto container">
      <Descriptions
        title="Thông tin phiếu mượn"
        bordered
      >
        <Descriptions.Item label="Người mượn">{borrow.user.name}</Descriptions.Item>
        <Descriptions.Item label="Sách">{borrow.book.title}</Descriptions.Item>
        <Descriptions.Item label="Ngày mượn">{dayjs(borrow.borrowDate).format('DD/MM/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Ngày trả">{dayjs(borrow.returnDate).format('DD/MM/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{borrow.status}</Descriptions.Item>
      </Descriptions>
    </section>
  );
}
