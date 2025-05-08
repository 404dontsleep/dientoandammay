import { Routes, Route } from 'react-router-dom';
import Books from './pages/books';
import MainLayout from './layouts/main-layout';
import Home from './pages';
import AddBook from './pages/books/add';
import ListBooks from './pages/books/list';
import ViewBook from './pages/books/view';
import EditBook from './pages/books/edit';
import AddUser from './pages/users/add';
import ListUsers from './pages/users/list';
import ViewUser from './pages/users/view';
import EditUser from './pages/users/edit';
import Users from './pages/users';
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<MainLayout />}
      >
        <Route
          index
          element={<Home />}
        />
        <Route
          path="/books"
          element={<Books />}
        />
        <Route
          path="/books/add"
          element={<AddBook />}
        />
        <Route
          path="/books/list"
          element={<ListBooks />}
        />
        <Route
          path="/books/:id"
          element={<ViewBook />}
        />
        <Route
          path="/books/edit/:id"
          element={<EditBook />}
        />
        <Route
          path="/users"
          element={<Users />}
        />
        <Route
          path="/users/list"
          element={<ListUsers />}
        />
        <Route
          path="/users/add"
          element={<AddUser />}
        />
        <Route
          path="/users/:id"
          element={<ViewUser />}
        />
        <Route
          path="/users/edit/:id"
          element={<EditUser />}
        />
      </Route>
    </Routes>
  );
}

export default App;
