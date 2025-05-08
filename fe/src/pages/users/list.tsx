import useSWR, { mutate } from 'swr';
import { App, Button, Input, Popconfirm, Table } from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userApi from '../../api/userApi';
import useDebounce from '../../hooks/useDebounce';
import { PencilIcon, TrashIcon } from 'lucide-react';
export default function ListUsers() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { message } = App.useApp();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { data: users } = useSWR(`/users?page=${page}&limit=10&search=${debouncedSearch}`, () =>
    userApi.getUsers(page, 10, debouncedSearch),
  );
  const navigate = useNavigate();

  const handleDeleteUser = useCallback(
    (id: string) => {
      userApi
        .deleteUser(id)
        .then(() => {
          message.success('User deleted successfully');
          mutate(`/users?page=${page}&limit=10&search=${search}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [message, page, search],
  );

  const columns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: (_text: string, record: { _id: string }) => (
        <div className="flex gap-2">
          <Button
            type="link"
            onClick={() => navigate(`/users/${record._id}`)}
          >
            Xem
          </Button>
          <Button
            color="primary"
            variant="solid"
            onClick={() => navigate(`/users/edit/${record._id}`)}
            shape="round"
          >
            <PencilIcon />
          </Button>
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn có chắc chắn muốn xóa người dùng này không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => handleDeleteUser(record._id)}
          >
            <Button
              variant="dashed"
              color="danger"
              shape="round"
            >
              <TrashIcon />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <section className="flex flex-col mx-auto container">
      <Table
        size="small"
        title={() => (
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '300px' }}
            />
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/users/add')}
            >
              Thêm người dùng
            </Button>
          </div>
        )}
        pagination={{
          pageSize: 10,
          current: page,
          total: users?.total || 0,
          onChange: (page) => setPage(page),
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        loading={isLoading}
        dataSource={users?.users || []}
        columns={columns}
      />
    </section>
  );
}
