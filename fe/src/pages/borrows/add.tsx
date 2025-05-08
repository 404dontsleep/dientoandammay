import { App, Button, DatePicker, Form, Select } from 'antd';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import borrowApi from '../../api/borrowApi';
import useSWR from 'swr';
import bookApi from '../../api/bookApi';
import userApi from '../../api/userApi';
import dayjs from 'dayjs';
import { AxiosError } from 'axios';
export default function AddBorrow() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data: books } = useSWR('/books', () => bookApi.getBooks());
  const { data: users } = useSWR('/users', () => userApi.getUsers());

  const handleSubmit = useCallback(
    async (values: { userId: string; bookId: string; dueDate: dayjs.Dayjs }) => {
      try {
        await borrowApi.createBorrow({
          userId: values.userId,
          bookId: values.bookId,
          dueDate: values.dueDate.format('YYYY-MM-DD'),
        });
        message.success('Thêm phiếu mượn thành công');
        navigate('/borrows');
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          message.error(error.response?.data.message);
        }
      }
    },
    [message, navigate],
  );

  return (
    <section className="flex flex-col mx-auto container">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Người mượn"
          name="userId"
          rules={[{ required: true, message: 'Vui lòng chọn người mượn' }]}
        >
          <Select
            placeholder="Chọn người mượn"
            options={users?.users.map((user) => ({
              label: user.name,
              value: user._id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Sách"
          name="bookId"
          rules={[{ required: true, message: 'Vui lòng chọn sách' }]}
        >
          <Select
            placeholder="Chọn sách"
            options={books?.books.map((book) => ({
              label: book.title,
              value: book._id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Ngày hẹn trả"
          name="dueDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày hẹn trả' }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            disabledDate={(current) => current < dayjs()}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
          >
            Thêm phiếu mượn
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}
