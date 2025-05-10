import React from "react";

const CookiePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">Cookie Policy</h1>
      <p className="mb-4">
        This Cookie Policy explains how <strong>MuseumGo.in</strong> uses cookies and similar technologies when you visit our website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">What Are Cookies?</h2>
      <p className="mb-4">
        Cookies are small text files placed on your device to help us enhance user experience, understand usage patterns, and improve services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Cookies</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To remember your language preferences in the chatbot.</li>
        <li>To enable secure sessions for logged-in users.</li>
        <li>To collect analytics data (e.g., via Google Analytics) to improve functionality and performance.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Managing Cookies</h2>
      <p className="mb-4">
        You can manage or delete cookies from your browser settings. However, disabling cookies may affect the chatbot and ticket booking experience.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Updates</h2>
      <p>
        This policy may be updated periodically. We encourage users to check this page regularly for any changes.
      </p>
    </div>
  );
};

export default CookiePolicy;
