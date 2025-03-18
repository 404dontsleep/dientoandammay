import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addBook, updateBook, getBookById, Book } from "../api/bookApi";

export default function Product({
  action,
}: {
  action: "add" | "edit" | "view";
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getBookById(id).then((book: Book) => {
        setTitle(book.title);
        setAuthor(book.author);
        setDescription(book.description || "");
        setPublishedYear(book.publishedYear.toString());
      });
    }
  }, [id]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === "view") {
      return;
    }
    const book = {
      _id: id || "",
      title,
      author,
      description,
      publishedYear: Number(publishedYear),
    };

    const promise = action === "edit" ? updateBook(id!, book) : addBook(book);

    promise
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        setError(err.message);
      });
  };
  const goBack = () => {
    navigate("/");
  };

  return (
    <section className="container mx-auto flex flex-col">
      <h1 className="text-2xl font-bold">
        {action === "add"
          ? "Create Book"
          : action === "edit"
          ? "Edit Book"
          : "View Book"}
      </h1>
      <form
        onSubmit={onSubmit}
        className="mt-2 flex flex-col gap-6 mx-auto w-full bg-white shadow-lg rounded-lg p-8"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-gray-700 font-semibold">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={action === "view"}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="author" className="text-gray-700 font-semibold">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={action === "view"}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-gray-700 font-semibold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={action === "view"}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="publishedYear"
            className="text-gray-700 font-semibold"
          >
            Published Year
          </label>
          <input
            type="number"
            id="publishedYear"
            name="publishedYear"
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
            disabled={action === "view"}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {action !== "view" && (
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200 mt-4"
          >
            {action === "add" ? "Create Book" : "Update Book"}
          </button>
        )}
        {action === "view" && (
          <button
            onClick={goBack}
            className="bg-slate-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-slate-700 transition duration-200 mt-4"
          >
            Go Back
          </button>
        )}
      </form>
    </section>
  );
}
