import React from 'react';
import './Home.css';
import Footer from '../components/Footer';
import Card from '../components/Card/Card';

const HomePage: React.FC = () => {
  return (
    <div className="Home">
      <header className="App-header">
        <h1>Welcome to Decentral Finance</h1>
        <p>Your gateway to decentralized financial solutions.</p>
      </header>
      <main>
        <div className="card-container">
          <Card title="Secure" description="Top-notch security for all your transactions." />
          <Card title="Transparent" description="Clear and transparent operations." />
          <Card title="Innovative" description="Cutting-edge financial technology." />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
