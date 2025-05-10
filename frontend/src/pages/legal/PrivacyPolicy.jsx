import React from "react";

function PrivacyPolicy() {
  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 italic text-sm">Effective Date: January 1, 2025</p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Introduction</h2>
      <p>
        We are committed to safeguarding your personal data. This Privacy Policy explains how we collect,
        use, and protect the information you provide.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Information We Collect</h2>
      <ul className="list-disc list-inside ml-4">
        <li>Personal Information: name, email, phone, etc.</li>
        <li>Payment Information: used securely via our payment gateway</li>
        <li>Usage Data: pages visited, clicks, device info</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. Use of Information</h2>
      <p>
        We use your data to provide services, process payments, respond to support requests,
        and improve your experience on our platform.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Sharing of Information</h2>
      <p>
        We do not sell your data. We only share information with third-party providers as necessary to deliver services,
        such as payment processors and analytics tools.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Cookies and Tracking</h2>
      <p>
        We use cookies to understand site traffic and user behavior. You can control cookie settings
        in your browser preferences.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Data Security</h2>
      <p>
        We implement encryption, secure servers, and access controls to protect your data.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. Data Retention</h2>
      <p>
        We retain personal data only as long as necessary to fulfill legal or operational purposes.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">8. Your Rights</h2>
      <ul className="list-disc list-inside ml-4">
        <li>Access your personal data</li>
        <li>Request correction or deletion</li>
        <li>Withdraw consent to data processing</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">9. Children's Privacy</h2>
      <p>
        We do not knowingly collect data from children under 13. If you believe a child has provided
        personal information, please contact us immediately.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy. Any changes will be posted on this page with an updated date.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">11. Contact Us</h2>
      <p>
        If you have any privacy concerns, contact us at <a href="mailto:support@museumgo.in" className="text-blue-600 underline">support@museumgo.in</a>.
      </p>
    </div>
  );
}

export default PrivacyPolicy;
