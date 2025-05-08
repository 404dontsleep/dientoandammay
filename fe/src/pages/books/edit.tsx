import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import bookApi from '../../api/bookApi';
import { App, Button, Form, Input, InputNumber, Card, DatePicker } from 'antd';
import { useEffect } from 'react';
import dayjs from 'dayjs';

export default function EditBook() {
  const { id } = useParams();
  const { data: book, isLoading } = useSWR(`/books/${id}`, () => bookApi.getBookById(id as string));
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    if (book) {
      form.setFieldsValue({
        title: book.title,
        author: book.author,
        description: book.description,
        publishedYear: dayjs().year(book.publishedYear),
        quantity: book.quantity,
        available: book.available,
      });
    }
  }, [book, form]);

  const handleSubmit = async (values: {
    title: string;
    author: string;
    publishedYear: dayjs.Dayjs;
    quantity: number;
    description: string;
    available: number;
  }) => {
    try {
      await bookApi.updateBook(id as string, {
        ...values,
        publishedYear: values.publishedYear.year(),
      });
      message.success('Update book successfully');
      navigate(`/books/list`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error('Lỗi: ' + error.message);
      } else {
        message.error('Đã xảy ra lỗi không xác định');
      }
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-4">Loading...</div>;
  }

  return (
    <section className="flex flex-col mx-auto container">
      <Card>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter book title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="Author"
            rules={[{ required: true, message: 'Please enter author name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="publishedYear"
            label="Published Year"
            rules={[{ required: true, message: 'Please enter published year' }]}
          >
            <DatePicker picker="year" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter book quantity' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="available"
            label="Available"
            rules={[{ required: true, message: 'Please enter available quantity' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
            >
              Update Book
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </section>
  );
}
