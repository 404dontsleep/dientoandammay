import useSWR, { mutate } from 'swr';
import bookApi from '../../api/bookApi';
import { App, Button, Input, Popconfirm, Table } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, Search, TrashIcon } from 'lucide-react';

export default function ListBooks() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { message } = App.useApp();
  const [search, setSearch] = useState('');
  const { data: books } = useSWR(`/books?page=${page}&limit=10&search=${search}`, () =>
    bookApi.getBooks(page, 10, search),
  );
  const navigate = useNavigate();

  const handleDeleteBook = useCallback(
    (id: string) => {
      bookApi
        .deleteBook(id)
        .then(() => {
          message.success('Xóa sách thành công');
          mutate(`/books?page=${page}&limit=10`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [message, page],
  );

  useEffect(() => {}, [search]);

  const columns = useMemo(
    () => [
      {
        title: 'Tên sách',
        dataIndex: 'title',
      },
      {
        title: 'Tác giả',
        dataIndex: 'author',
      },
      {
        title: 'Năm xuất bản',
        dataIndex: 'publishedYear',
      },
      {
        title: 'Số lượng',
        dataIndex: 'quantity',
      },
      {
        title: 'Số lượng còn lại',
        dataIndex: 'available',
      },
      {
        title: 'Hành động',
        dataIndex: 'action',
        render: (_text: string, record: { _id: string }) => (
          <div className="flex gap-2">
            <Button
              type="link"
              onClick={() => navigate(`/books/${record._id}`)}
            >
              Xem
            </Button>
            <Button
              color="primary"
              variant="solid"
              shape="round"
              onClick={() => navigate(`/books/edit/${record._id}`)}
            >
              <PencilIcon />
            </Button>
            <Popconfirm
              title="Xóa sách"
              description="Bạn có chắc chắn muốn xóa sách này?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handleDeleteBook(record._id)}
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
    ],
    [handleDeleteBook, navigate],
  );
  return (
    <section className="flex flex-col mx-auto container">
      <Table
        size="small"
        title={() => (
          <div className="flex justify-between items-center">
            <Input
              placeholder="Tìm kiếm"
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '300px' }}
              size="large"
              prefix={<Search />}
            />
            <Button
              type="primary"
              onClick={() => navigate('/books/add')}
              size="large"
            >
              Thêm sách
            </Button>
          </div>
        )}
        pagination={{
          pageSize: 10,
          current: page,
          total: books?.total || 0,
          onChange: (page) => setPage(page),
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
        }}
        loading={isLoading}
        dataSource={books?.books || []}
        columns={columns}
      />
    </section>
  );
}
