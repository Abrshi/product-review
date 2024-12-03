import { useEffect, useState } from "react";
import axiosInstance from "../../api/endPoint";
import { Link } from "react-router-dom";

// Define a Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrls: string;
}

function Products() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("All");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchCategory, setSearchCategory] = useState<string>("");

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch products from the backend
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/products")
      .then((res) => {
        setProducts(res.data.data);
        setFilteredProducts(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // Generate unique categories dynamically from products
  const uniqueCategories = Array.from(
    new Set(products.map((product) => product.category))
  );

  // Handle category selection
  const handleCategoryChange = (selectedCategory: string) => {
    setCategory(selectedCategory);
    applyFiltersAndSort(selectedCategory, minPrice, maxPrice, sortOrder);
  };

  // Filter and sort products based on category, price, and sort order
  const applyFiltersAndSort = (
    category: string,
    minPrice: number | "",
    maxPrice: number | "",
    sortOrder: "asc" | "desc"
  ) => {
    let filtered = [...products];

    if (category !== "All") {
      filtered = filtered.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (minPrice !== "") {
      filtered = filtered.filter((product) => product.price >= minPrice);
    }

    if (maxPrice !== "") {
      filtered = filtered.filter((product) => product.price <= maxPrice);
    }

    if (sortOrder === "asc") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  // Handle price input changes (min/max)
  const handlePriceChange = (minOrMax: string, value: string) => {
    if (minOrMax === "min") {
      setMinPrice(Number(value) || "");
    } else {
      setMaxPrice(Number(value) || "");
    }
  };

  // Handle sorting
  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    applyFiltersAndSort(category, minPrice, maxPrice, order);
  };

  // Apply price filter
  const applyPriceFilter = () => {
    applyFiltersAndSort(category, minPrice, maxPrice, sortOrder);
  };

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <div className="flex w-full">
        {/* Hamburger Menu */}
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-md shadow-lg"
        >
          {/* Hamburger Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Sidebar */}
            <div
            className={`h-[100vh] sticky top-16  bg-white shadow-lg p-6 transition-transform duration-300 ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full h-[100vh] sticky top-16"
            }  md:translate-x-0 md:w-1/5 h-[100vh] sticky top-16`}// Replace overflow-y-auto with overflow-hidden
            >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Filter Products
          </h2>

          {/* Close Button for Mobile */}
          <button
            onClick={toggleSidebar}
            className="md:hidden absolute top-4 right-4 text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Sidebar Content */}
          <div className="mb-6  sticky top-auto">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Categories
            </h3>
            <input
              type="text"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              placeholder="Search categories..."
              className="border border-gray-300 rounded-md p-2 w-full mb-3"
            />
            <div 
  className="flex flex-col space-y-2 max-h-32 overflow-y-auto "
>
  {["All", ...uniqueCategories]
    .filter((cat) =>
      cat.toLowerCase().includes(searchCategory.toLowerCase())
    )
    .map((cat) => (
      <div
        key={cat}
        className="cursor-pointer p-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        onClick={() => handleCategoryChange(cat)}
      >
        {cat}
      </div>
    ))}
</div>

          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Price Range
            </h3>
            <div className="flex space-x-2">
              <input
                placeholder="Min"
                type="number"
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full px-2 py-1"
                value={minPrice}
                onChange={(e) => handlePriceChange("min", e.target.value)}
              />
              <input
                placeholder="Max"
                type="number"
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full px-2 py-1"
                value={maxPrice}
                onChange={(e) => handlePriceChange("max", e.target.value)}
              />
            </div>
            <button
              onClick={applyPriceFilter}
              className="w-full mt-3 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
            >
              Apply
            </button>
          </div>

          <div className="p-2 flex justify-between">
            <button
              onClick={() => handleSortChange("asc")}
              className="border border-gray-300 p-2 rounded-md hover:bg-blue-200 active:bg-blue-400 transition"
            >
              Low to High
            </button>
            <button
              onClick={() => handleSortChange("desc")}
              className="border border-gray-300 p-2 rounded-md hover:bg-blue-200 active:bg-blue-400 transition"
            >
              High to Low
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-wrap justify-center gap-4 py-10 w-full md:w-4/5">
          {loading ? (
            <div className="text-center w-full py-10">Loading...</div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((info) => (
              <div
                key={info.id}
                className="h-80 w-72 bg-cover bg-center bg-no-repeat rounded-lg p-4 flex flex-col items-center mb-10"
              >
                <Link to={`/product/${info.id}`} className="w-full">
                  <img
                    src={info.imageUrls}
                    alt={info.name}
                    className="h-56 w-auto object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {info.name}
                  </h3>
                  <p className="text-gray-600">${info.price}</p>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center w-full py-10">
              No products found matching the filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
