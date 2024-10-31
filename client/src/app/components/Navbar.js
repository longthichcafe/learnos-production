// app/components/Navbar.js
"use client"; // Necessary if you plan to manage state or client-side functionality

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-300 p-4 fixed top-0 left-0 w-full z-50 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-black text-2xl font-bold">
          LearnOS
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-black hover:text-gray-700">Home</Link>
          <Link href="/contact" className="text-black hover:text-gray-700">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
