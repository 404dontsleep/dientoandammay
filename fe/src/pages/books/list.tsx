import useSWR, { mutate } from 'swr';
import bookApi from '../../api/bookApi';
import { App, Button, Input, Popconfirm, Table } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
          message.success('Book deleted successfully');
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
        title: 'Title',
        dataIndex: 'title',
      },
      {
        title: 'Author',
        dataIndex: 'author',
      },
      {
        title: 'Published Year',
        dataIndex: 'publishedYear',
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
      },
      {
        title: 'Available',
        dataIndex: 'available',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: (_text: string, record: { _id: string }) => (
          <div className="flex gap-2">
            <Button
              type="link"
              onClick={() => navigate(`/books/${record._id}`)}
            >
              View
            </Button>
            <Button
              color="primary"
              variant="solid"
              onClick={() => navigate(`/books/edit/${record._id}`)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDeleteBook(record._id)}
            >
              <Button
                variant="dashed"
                color="danger"
              >
                Delete
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
        title={() => (
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '300px' }}
            />
            <Button
              type="primary"
              onClick={() => navigate('/books/add')}
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
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        loading={isLoading}
        dataSource={books?.books || []}
        columns={columns}
      />
    </section>
  );
}
