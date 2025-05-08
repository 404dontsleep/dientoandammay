import { useState, useEffect } from 'react';
import { Card, Tabs, DatePicker, Space, Table, Row, Col, Statistic } from 'antd';
import { Line } from '@ant-design/plots';
import dayjs from 'dayjs';
import axios from 'axios';

const { RangePicker } = DatePicker;

interface BorrowStats {
  _id: string;
  count: number;
}

interface BookStats {
  mostBorrowed: {
    title: string;
    author: string;
    borrowCount: number;
  } | null;
  leastBorrowed: {
    title: string;
    author: string;
    borrowCount: number;
  } | null;
  neverBorrowed: Array<{
    title: string;
    author: string;
  }>;
  conditionStats: Array<{
    title: string;
    author: string;
    condition: string;
    count: number;
  }>;
}

interface UserStats {
  mostActiveUser: {
    name: string;
    email: string;
    borrowCount: number;
  } | null;
  overdueUsers: Array<{
    name: string;
    email: string;
    overdueCount: number;
  }>;
  usersWithBooks: Array<{
    name: string;
    email: string;
    books: Array<{
      title: string;
      author: string;
    }>;
  }>;
}

export default function Stats() {
  const [activeTab, setActiveTab] = useState('borrows');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(6, 'month'), dayjs()]);
  const [borrowStats, setBorrowStats] = useState<{
    borrowStats: BorrowStats[];
    returnStats: number;
    currentlyBorrowed: number;
    overdue: number;
  }>({
    borrowStats: [],
    returnStats: 0,
    currentlyBorrowed: 0,
    overdue: 0,
  });
  const [bookStats, setBookStats] = useState<BookStats>({
    mostBorrowed: null,
    leastBorrowed: null,
    neverBorrowed: [],
    conditionStats: [],
  });
  const [userStats, setUserStats] = useState<UserStats>({
    mostActiveUser: null,
    overdueUsers: [],
    usersWithBooks: [],
  });

  useEffect(() => {
    fetchBorrowStats();
  }, [dateRange]);

  const fetchBorrowStats = async () => {
    try {
      const response = await axios.get('/api/statistics/borrows', {
        params: {
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].format('YYYY-MM-DD'),
          groupBy: 'month',
        },
      });
      setBorrowStats(response.data);
    } catch (error) {
      console.error('Error fetching borrow stats:', error);
    }
  };

  const fetchBookStats = async () => {
    try {
      const response = await axios.get('/api/statistics/books', {
        params: {
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].format('YYYY-MM-DD'),
        },
      });
      setBookStats(response.data);
    } catch (error) {
      console.error('Error fetching book stats:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('/api/statistics/users', {
        params: {
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].format('YYYY-MM-DD'),
        },
      });
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  const borrowColumns = [
    {
      title: 'Thời gian',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Số lượng mượn',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: BorrowStats, b: BorrowStats) => a.count - b.count,
    },
  ];

  const bookConditionColumns = [
    {
      title: 'Tên sách',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Tình trạng',
      dataIndex: 'condition',
      key: 'condition',
      render: (condition: string) => (condition === 'lost' ? 'Mất' : 'Hư hỏng'),
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  const overdueUserColumns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số lần trễ hạn',
      dataIndex: 'overdueCount',
      key: 'overdueCount',
      sorter: (a: { overdueCount: number }, b: { overdueCount: number }) => a.overdueCount - b.overdueCount,
    },
  ];

  const items = [
    {
      key: 'borrows',
      label: 'Thống kê mượn/trả sách',
      children: (
        <Card>
          <Row
            gutter={16}
            className="mb-4"
          >
            <Col span={6}>
              <Statistic
                title="Số lượt mượn"
                value={borrowStats.borrowStats.reduce((acc, curr) => acc + curr.count, 0)}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Số lượt trả"
                value={borrowStats.returnStats}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Đang mượn"
                value={borrowStats.currentlyBorrowed}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Quá hạn"
                value={borrowStats.overdue}
              />
            </Col>
          </Row>
          <div className="mb-4">
            <Line
              data={borrowStats.borrowStats}
              xField="_id"
              yField="count"
              point={{
                size: 5,
                shape: 'diamond',
              }}
            />
          </div>
          <Table
            dataSource={borrowStats.borrowStats}
            columns={borrowColumns}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
    {
      key: 'books',
      label: 'Thống kê theo sách',
      children: (
        <Card>
          <Row
            gutter={16}
            className="mb-4"
          >
            <Col span={12}>
              <Card title="Sách mượn nhiều nhất">
                {bookStats.mostBorrowed ? (
                  <>
                    <p>Tên sách: {bookStats.mostBorrowed.title}</p>
                    <p>Tác giả: {bookStats.mostBorrowed.author}</p>
                    <p>Số lượt mượn: {bookStats.mostBorrowed.borrowCount}</p>
                  </>
                ) : (
                  <p>Không có dữ liệu</p>
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Sách mượn ít nhất">
                {bookStats.leastBorrowed ? (
                  <>
                    <p>Tên sách: {bookStats.leastBorrowed.title}</p>
                    <p>Tác giả: {bookStats.leastBorrowed.author}</p>
                    <p>Số lượt mượn: {bookStats.leastBorrowed.borrowCount}</p>
                  </>
                ) : (
                  <p>Không có dữ liệu</p>
                )}
              </Card>
            </Col>
          </Row>
          <Card
            title="Sách bị mất/hư hỏng"
            className="mb-4"
          >
            <Table
              dataSource={bookStats.conditionStats}
              columns={bookConditionColumns}
              rowKey={(record) => `${record.title}-${record.condition}`}
              pagination={{ pageSize: 10 }}
            />
          </Card>
          <Card title="Sách chưa từng được mượn">
            <Table
              dataSource={bookStats.neverBorrowed}
              columns={[
                {
                  title: 'Tên sách',
                  dataIndex: 'title',
                  key: 'title',
                },
                {
                  title: 'Tác giả',
                  dataIndex: 'author',
                  key: 'author',
                },
              ]}
              rowKey="title"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Card>
      ),
    },
    {
      key: 'users',
      label: 'Thống kê theo bạn đọc',
      children: (
        <Card>
          <Card
            title="Bạn đọc tích cực nhất"
            className="mb-4"
          >
            {userStats.mostActiveUser ? (
              <>
                <p>Tên: {userStats.mostActiveUser.name}</p>
                <p>Email: {userStats.mostActiveUser.email}</p>
                <p>Số lượt mượn: {userStats.mostActiveUser.borrowCount}</p>
              </>
            ) : (
              <p>Không có dữ liệu</p>
            )}
          </Card>
          <Card
            title="Bạn đọc thường xuyên trễ hạn"
            className="mb-4"
          >
            <Table
              dataSource={userStats.overdueUsers}
              columns={overdueUserColumns}
              rowKey="email"
              pagination={{ pageSize: 10 }}
            />
          </Card>
          <Card title="Danh sách bạn đọc đang mượn sách">
            <Table
              dataSource={userStats.usersWithBooks}
              columns={[
                {
                  title: 'Tên người dùng',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Email',
                  dataIndex: 'email',
                  key: 'email',
                },
                {
                  title: 'Sách đang mượn',
                  dataIndex: 'books',
                  key: 'books',
                  render: (books: Array<{ title: string; author: string }>) => (
                    <ul>
                      {books.map((book, index) => (
                        <li key={index}>
                          {book.title} - {book.author}
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ]}
              rowKey="email"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Card>
      ),
    },
  ];

  return (
    <div className="p-6 container mx-auto">
      <Space
        direction="vertical"
        size="large"
        style={{ width: '100%' }}
      >
        <RangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          allowClear={false}
        />
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          onTabClick={(key) => {
            switch (key) {
              case 'borrows':
                fetchBorrowStats();
                break;
              case 'books':
                fetchBookStats();
                break;
              case 'users':
                fetchUserStats();
                break;
            }
          }}
        />
      </Space>
    </div>
  );
}
