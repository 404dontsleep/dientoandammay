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
import Borrows from './pages/borrows';
import ListBorrows from './pages/borrows/list';
import AddBorrow from './pages/borrows/add';
import ViewBorrow from './pages/borrows/view';
import Stats from './pages/stats';
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
        <Route
          path="/borrows"
          element={<Borrows />}
        />
        <Route
          path="/borrows/list"
          element={<ListBorrows />}
        />
        <Route
          path="/borrows/add"
          element={<AddBorrow />}
        />
        <Route
          path="/borrows/:id"
          element={<ViewBorrow />}
        />
        <Route
          path="/stats"
          element={<Stats />}
        />
      </Route>
    </Routes>
  );
}

export default App;
