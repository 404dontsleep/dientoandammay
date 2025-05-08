import useSWR, { mutate } from 'swr';
import borrowApi from '../../api/borrowApi';
import { Button, Form, Input, Modal, Select, Table, DatePicker } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import useSWRMutation from 'swr/mutation';
import { Search } from 'lucide-react';

export default function ListBorrows() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [borrowDate, setBorrowDate] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);
  const { data: borrows } = useSWR(
    `/borrows?page=${page}&limit=10&search=${debouncedSearch}${borrowDate ? `&borrowDate=${borrowDate}` : ''}`,
    () => borrowApi.getBorrows(page, 10, debouncedSearch, borrowDate || undefined),
    {
      keepPreviousData: false,
    },
  );
  const navigate = useNavigate();

  useEffect(() => {
    mutate(`/borrows?page=${page}&limit=10&search=${debouncedSearch}${borrowDate ? `&borrowDate=${borrowDate}` : ''}`);
  }, [page, debouncedSearch, borrowDate]);

  const columns = useMemo(
    () => [
      {
        title: 'Người mượn',
        dataIndex: ['user', 'name'],
        render: (_text: string, record: unknown) => (record as { user?: { name: string } }).user?.name || 'N/A',
      },
      {
        title: 'Sách',
        dataIndex: ['book', 'title'],
        render: (_text: string, record: unknown) => (record as { book?: { title: string } }).book?.title || 'N/A',
      },
      {
        title: 'Ngày mượn',
        dataIndex: 'borrowDate',
        render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      },
      {
        title: 'Ngày hẹn trả',
        dataIndex: 'dueDate',
        render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (status: string, record: unknown) => {
          if (status === 'returned') {
            return 'Đã trả';
          }
          const borrow = record as { dueDate: string };
          const today = new Date();
          const dueDate = new Date(borrow.dueDate);
          if (dueDate < today) {
            return 'Quá hạn';
          }
          return 'Đang mượn';
        },
      },
      {
        title: 'Thao tác',
        dataIndex: 'action',
        render: (_text: string, record: { _id: string; status: string }) => (
          <div className="flex gap-2">
            <Button
              type="link"
              onClick={() => navigate(`/borrows/${record._id}`)}
            >
              Xem
            </Button>
            {record.status === 'borrowed' && <RefundModal id={record._id} />}
          </div>
        ),
      },
    ],
    [navigate],
  );
  return (
    <section className="flex flex-col mx-auto container">
      <Table
        size="small"
        title={() => (
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Input
                placeholder="Tìm kiếm"
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '300px' }}
                size="large"
                prefix={<Search />}
              />
              <DatePicker
                placeholder="Chọn ngày mượn"
                onChange={(date) => setBorrowDate(date ? date.format('YYYY-MM-DD') : null)}
                size="large"
              />
            </div>
            <Button
              type="primary"
              onClick={() => navigate('/borrows/add')}
              size="large"
            >
              Mượn sách
            </Button>
          </div>
        )}
        pagination={{
          pageSize: 10,
          current: page,
          total: borrows?.total || 0,
          onChange: (page) => setPage(page),
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
        }}
        dataSource={borrows?.borrows || []}
        columns={columns}
        rowKey="_id"
      />
    </section>
  );
}

function RefundModal({ id }: { id: string }) {
  const { trigger, isMutating } = useSWRMutation('/borrows/return', (_key, { arg }) => borrowApi.returnBook(id, arg));
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const handleSubmit = () => {
    trigger(form.getFieldValue('bookCondition'));
  };
  return (
    <>
      <Button
        type="primary"
        onClick={() => setOpen(true)}
      >
        Trả sách
      </Button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={isMutating}
        title="Trả sách"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="bookCondition"
            label="Tình trạng sách"
          >
            <Select>
              <Select.Option value="normal">Bình thường</Select.Option>
              <Select.Option value="damaged">Bị hư hỏng</Select.Option>
              <Select.Option value="lost">Mất</Select.Option>
              <Select.Option value="overdue">Quá hạn</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
