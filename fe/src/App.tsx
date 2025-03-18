import { Routes, Route } from "react-router-dom";
import Product from "./pages/product";
import ProductList from "./pages/product-list";
import MainLayout from "./layouts/main-layout";
import ErrorBoundary from "./layouts/error-layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <ProductList />
            </ErrorBoundary>
          }
        />
        <Route path="/create" element={<Product action="add" />} />
        <Route path="/edit/:id" element={<Product action="edit" />} />
        <Route path="/view/:id" element={<Product action="view" />} />
      </Route>
    </Routes>
  );
}

export default App;
