'use client';
import { useState, useEffect } from 'react';
import Footer from 'src/components/Footer';
import { SW_LINK } from 'src/links';
import { useAccount } from 'wagmi';
import LoginButton from '../components/LoginButton';
import SignupButton from '../components/SignupButton';
import TitleSvg from 'src/svg/TitleSvg';

export default function Page() {
  const { address } = useAccount();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (address) {
      setShowForm(true);
    }
  }, [address]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { firstName, email } = formData;

      // Send email
      const emailResponse = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email }),
      });
      const emailData = await emailResponse.json();
      if (!emailResponse.ok) throw new Error(emailData.error || 'Failed to send email');

      // Create contact
      const contactResponse = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email }),
      });
      const contactData = await contactResponse.json();
      if (!contactResponse.ok) throw new Error(contactData.error || 'Failed to create contact');

      console.log('Subscription successful:', { emailData, contactData });
      setIsSubscribed(true);
      
      // Set a timeout to close the popup after 3 seconds
      setTimeout(() => {
        setShowForm(false);
        setIsSubscribed(false);
      }, 3000);
    } catch (error) {
      console.error('Error subscribing:', error);
      alert(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowForm(false);
    }
  };

  return (
    <div className="flex h-full w-96 max-w-full flex-col px-1 md:w-[1200px]">
      <section className="mt-6 mb-6 flex w-full">
        <div className="flex w-full flex-row items-center justify-between">
          <a
            href={SW_LINK}
            title="smart wallet"
            target="_blank"
            rel="noreferrer"
            className="flex items-center"
          >
            <TitleSvg />
          </a>
          <div className="flex items-center gap-3">
            <SignupButton />
            {!address && <LoginButton />}
          </div>
        </div>
      </section>
      <section className="templateSection flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-gray-100 px-2 py-4 md:grow">
        <div className="flex h-[450px] w-[450px] max-w-full items-center justify-center rounded-xl bg-[#030712]">
         <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-white font-inter">Welcome to Smart Wallet</h1>
          <p className="text-sm text-white font-inter">Demo app to showcase the Smart Wallet with Resend</p>
         </div>
        </div>
      </section>
      {showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-6 rounded-lg w-64">
            {isSubscribed ? (
              <h2 className="text-xl font-bold text-center text-purple-600">Subscribed!</h2>
            ) : (
              <form onSubmit={handleSubscribe}>
                <h2 className="text-xl font-bold mb-4">Join our mailing list</h2>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full mb-2 p-2 border rounded text-sm"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full mb-2 p-2 border rounded text-sm"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mb-4 p-2 border rounded text-sm"
                  required
                />
                <button 
                  type="submit" 
                  className="w-full bg-black text-white p-2 rounded font-inter text-sm"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}