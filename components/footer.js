"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 mt-16">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="font-bold">© {new Date().getFullYear()} Everwish</p>
        <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
          <button 
            onClick={() => alert('About page coming soon')}
            className="hover:text-pink-600 transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => alert('Contact: support@everwish.com')}
            className="hover:text-pink-600 transition-colors"
          >
            Contact
          </button>
          <button 
            onClick={() => alert('Privacy Policy coming soon')}
            className="hover:text-pink-600 transition-colors"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => alert('Terms coming soon')}
            className="hover:text-pink-600 transition-colors"
          >
            Terms
          </button>
        </div>
      </div>
    </footer>
  );
}
