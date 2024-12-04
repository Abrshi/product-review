const Footer = () => {
  return (
    <footer className="bg-blue-300 text-white py-4 text-center">
      <p className="text-sm text-gray-400">
        © {new Date().getFullYear()} All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
