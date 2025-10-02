"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 mt-16">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="font-bold">© {new Date().getFullYear()} Everwish</p>
        <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}
