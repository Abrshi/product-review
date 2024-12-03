// Header.tsx
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 px-40 border-b-2 border-gray-200 bg-gray-50 sticky top-0 z-10">
      {/* Logo */}
      <div className="text-2xl font-bold text-gray-800">LOGO</div>

      {/* Navigation */}
      <nav className="flex items-center gap-6">
        {/* Home Link */}
        <Link
          to="/"
          className="text-gray-700 text-lg hover:text-blue-600 transition duration-200"
        >
          Home
        </Link>
        <Link
          to="/products/add"
          className="text-gray-700 text-lg hover:text-blue-600 transition duration-200"
        >
          Creat
        </Link>
        <Link
          to="/"
          className="text-gray-700 text-lg hover:text-blue-600 transition duration-200"
        >
          Manage
        </Link>
        {/* Filter by Category Dropdown */}
      </nav>
    </header>
  );
}
