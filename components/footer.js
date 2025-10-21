"use client";
export default function Footer() {
  return (
    <footer className="w-full py-4 bg-gray-50 text-center text-sm text-gray-500 mt-10">
      © {new Date().getFullYear()} Everwish. All rights reserved.
    </footer>
  );
}
