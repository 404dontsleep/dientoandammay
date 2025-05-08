import { Routes, Route } from 'react-router-dom';
import Books from './pages/books';
import MainLayout from './layouts/main-layout';
import Home from './pages';
import AddBook from './pages/books/add';
import ListBooks from './pages/books/list';
import ViewBook from './pages/books/view';
import EditBook from './pages/books/edit';
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
      </Route>
    </Routes>
  );
}

export default App;
