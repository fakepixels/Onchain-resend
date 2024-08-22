'use client'; // Indicates this is a Client Component in Next.js

import { useState, useEffect } from 'react';
import Footer from 'src/components/Footer';
import { SW_LINK } from 'src/links';
import { useAccount } from 'wagmi';
import LoginButton from '../components/LoginButton';
import SignupButton from '../components/SignupButton';
import TitleSvg from 'src/svg/TitleSvg';

export default function Page() {
  // Use wagmi hook to get the connected wallet address
  const { address } = useAccount();
  
  // State variables
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isMember, setIsMember] = useState(false);

  // Update form visibility and member status based on wallet connection
  useEffect(() => {
    if (address) {
      setShowForm(true);
    } else {
      setShowForm(false);
      setIsMember(false);
    }
  }, [address]);

  // Handle form submission
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { firstName, email } = formData;

      // Send email using API
      const emailResponse = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email }),
      });
      const emailData = await emailResponse.json();
      if (!emailResponse.ok) throw new Error(emailData.error || 'Failed to send email');

      // Create contact using API
      const contactResponse = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email }),
      });
      const contactData = await contactResponse.json();
      if (!contactResponse.ok) throw new Error(contactData.error || 'Failed to create contact');

      console.log('Subscription successful:', { emailData, contactData });
      setIsSubscribed(true);
      setIsMember(true);
      
      // Close the form after 3 seconds
      setTimeout(() => {
        setShowForm(false);
        setIsSubscribed(false);
      }, 3000);
    } catch (error) {
      console.error('Error subscribing:', error);
      alert(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Close the form when clicking outside
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowForm(false);
    }
  };

  return (
    <div className="flex h-full w-96 max-w-full flex-col px-1 md:w-[1200px] font-ibm-plex-sans">
      {/* Header section */}
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

      {/* Main content section */}
      <section className="templateSection flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-gray-100 px-2 py-4 md:grow">
        <div className="flex h-[450px] w-[450px] max-w-full items-center justify-center rounded-xl bg-[#030712]">
         <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold text-white font-inter">
            {isMember ? "You're now a member." : "Welcome to Smart Wallet"}
          </h1>
          <p className="text-sm text-white font-inter">
            {isMember ? "Thank you for joining!" : "Demo app to showcase the Smart Wallet with Resend"}
          </p>
         </div>
        </div>
      </section>

      {/* Subscription form popup */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-8 rounded-lg w-80 shadow-lg">
            {isSubscribed ? (
              <h2 className="text-2xl font-bold text-center text-black">Subscribed!</h2>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Join our mailing list</h2>
                {/* Form inputs */}
                <div className="space-y-2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:black"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:black"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:black"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold text-sm hover:bg-blue-700 transition duration-300 ease-in-out"
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