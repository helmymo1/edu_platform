import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center py-12 sm:px-6 lg:px-8">
      <h1 className="text-9xl font-extrabold text-blue-600 tracking-wider">404</h1>
      <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
        Page Not Found
      </h2>
      <p className="mt-4 text-lg text-gray-600">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div className="mt-10">
        <Link
          to="/"
          className="py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
