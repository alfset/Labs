import React from 'react';
import NewCarousel from '../components/NewCarousel/NewCarousel'; // Adjust path as necessary

const HomePage: React.FC = () => {
  return (
    <div className="Home">
      {/* Hero Section */}
      <header className="relative bg-gray-800 text-white py-20">
        <div className="absolute inset-0">
          <img
            src="/path-to-your-hero-image.jpg" // Replace with your hero image path
            alt="Hero Background"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Decentral Finance</h1>
          <p className="text-lg mb-6">Your gateway to decentralized financial solutions.</p>
          <a href="/get-started" className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600">
            Get Started
          </a>
        </div>
      </header>

      {/* Breakdown Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Secure</h3>
              <p>Top-notch security for all your transactions.</p>
            </div>
            {/* Example Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Transparent</h3>
              <p>Clear and transparent operations.</p>
            </div>
            {/* Example Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Innovative</h3>
              <p>Cutting-edge financial technology.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <main className="container mx-auto p-4">
        <div className="mt-10">
          <NewCarousel /> {/* Use the new carousel here */}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <p className="text-center mb-4">&copy; {new Date().getFullYear()} Decentral Finance. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
              <a href="/terms-of-service" className="hover:underline">Terms of Service</a>
              <a href="/contact" className="hover:underline">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
