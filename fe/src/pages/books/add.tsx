import { Form, Input, Button, DatePicker, Card, InputNumber, App } from 'antd';
import dayjs from 'dayjs';
import bookApi from '../../api/bookApi';
import { useNavigate } from 'react-router-dom';

export default function AddBook() {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const onFinish = (values: {
    title: string;
    author: string;
    publishedYear: dayjs.Dayjs;
    quantity: number;
    description: string;
  }) => {
    try {
      bookApi
        .addBook({
          ...values,
          available: values.quantity,
          publishedYear: values.publishedYear.year(),
        })
        .then(() => {
          message.success('Add book successfully');
          navigate('/books');
        })
        .catch((error: { message: string; response: { data: { message: string } } }) => {
          message.error('Lỗi: ' + error.response.data.message);
        });
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error('Lỗi: ' + error.message);
      } else {
        message.error('Đã xảy ra lỗi không xác định');
      }
    }
  };
  return (
    <section className="flex flex-col mx-auto container">
      <Card>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="title"
            label="Title"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="Author"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="publishedYear"
            label="Published Year"
          >
            <DatePicker picker="year" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
            >
              Add Book
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </section>
  );
}
