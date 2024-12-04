// Header.tsx
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 px-32 max-sm:px-24 border-b-2 border-gray-200 bg-blue-200 sticky top-0 z-10 w-[100vw] overflow-hidden">
      {/* Logo */}
      <div className="text-2xl font-bold text-gray-800">NOVA</div>

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
        
       </nav>
    </header>
  );
}
