import { deleteBook, getBooks, searchBooks } from "../api/bookApi";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
export default function ProductList() {
  const [books, setBooks] = useState<Awaited<ReturnType<typeof getBooks>>>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [error, setError] = useState<string | null>(null);
  const handleDelete = (id: string) => {
    deleteBook(id)
      .then(() => {
        setBooks(books.filter((book) => book._id !== id));
        alert("Book deleted successfully");
      })
      .catch((error) => alert(error.message));
  };
  useEffect(() => {
    if (debouncedSearch) {
      searchBooks(debouncedSearch)
        .then((data) => {
          setBooks(data);
        })
        .catch((error) => {
          setError(error.message);
        });
    } else {
      getBooks()
        .then((data) => {
          setBooks(data);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [debouncedSearch]);

  return (
    <section className="container mx-auto flex flex-col">
      <h1 className="text-2xl font-bold">Product List</h1>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="border-2 border-gray-300 rounded-md p-2 w-full"
        />
        {error && <p className="text-red-500">{error}</p>}
        <table className="table-auto w-full text-center ">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Description</th>
              <th>Published Year</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books ? (
              books.map((book) => (
                <tr key={book._id} className="border-b border-gray-200">
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.description}</td>
                  <td>{book.publishedYear}</td>
                  <td className="flex justify-center gap-2">
                    <Link to={`/edit/${book._id}`}>
                      <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md">
                        Edit
                      </button>
                    </Link>
                    <Link to={`/view/${book._id}`}>
                      <button className="bg-green-500 text-white text-sm px-4 py-2 rounded-md">
                        View
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="bg-red-500 text-white text-sm px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
