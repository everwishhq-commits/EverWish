"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-16 py-8 text-center border-t">
      <p className="text-gray-600 text-sm">
        © {new Date().getFullYear()} Everwish. All rights reserved.
      </p>
      <div className="mt-4 flex justify-center gap-6 text-gray-500 text-sm">
        <a href="#">Support</a>
        <a href="#">Pricing</a>
        <a href="#">Services</a>
        <a href="#">Login</a>
        <a href="#">Language</a>
      </div>
    </footer>
  );
}
