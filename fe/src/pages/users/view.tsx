import useSWR from 'swr';
import * as userApi from '../../api/userApi';
import { useParams, useNavigate, Link } from 'react-router-dom';
import borrowApi from '../../api/borrowApi';
import { Button, Table } from 'antd';

export default function ViewUser() {
  const { id } = useParams();
  const { data: user } = useSWR(`/users/${id}`, () => userApi.getUserById(id as string));
  const { data: borrows } = useSWR(`/borrows/user/${id}`, () => borrowApi.getUserBorrows(id as string));
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-4">
      {user && (
        <div className="bg-white shadow-md rounded-lg p-6 relative">
          <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
          <div className="absolute top-4 right-4">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate(`/users/edit/${id}`)}
            >
              Chỉnh sửa
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Email:</p>
              <p>{user.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Số điện thoại:</p>
              <p>{user.phone || 'Chưa cập nhật'}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Địa chỉ:</p>
              <p>{user.address || 'Chưa cập nhật'}</p>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-4">Lịch sử mượn sách</h2>
            <Table
              size="small"
              dataSource={borrows || []}
              columns={[
                {
                  title: 'Sách',
                  dataIndex: 'book',
                  render: (book: { title: string }) => book.title,
                },
                {
                  title: 'Ngày mượn',
                  dataIndex: 'borrowDate',
                  render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
                },
                {
                  title: 'Ngày trả',
                  dataIndex: 'returnDate',
                  render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  render: (status: string) => (status === 'returned' ? 'Đã trả' : 'Đang mượn'),
                },
                {
                  title: 'Tình trạng sách',
                  dataIndex: 'bookCondition',
                  render: (condition: string) => condition || 'Chưa cập nhật',
                },
                {
                  title: 'Ngày hẹn trả',
                  dataIndex: 'dueDate',
                  render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
                },
                {
                  title: 'Hành động',
                  key: 'action',
                  render: (_, record) => (
                    <Link
                      to={`/borrows/${record._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Xem chi tiết
                    </Link>
                  ),
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
