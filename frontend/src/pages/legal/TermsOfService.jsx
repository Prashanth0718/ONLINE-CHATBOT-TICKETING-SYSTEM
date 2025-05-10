import React from "react";

function TermsOfService() {
  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4 italic text-sm">Effective Date: January 1, 2025</p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
      <p>
        By using our website and services, you agree to be bound by these Terms
        of Service. If you do not agree to these terms, do not access or use our services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Use of the Service</h2>
      <p>
        You agree to use our services only for lawful purposes. You must not attempt to gain
        unauthorized access to our systems or misuse the services in any way.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">3. User Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials.
        You must notify us immediately of any unauthorized use of your account.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Ticketing and Payments</h2>
      <p>
        All ticket bookings are subject to availability. Payments are processed securely through our payment provider.
        Refunds are governed by our cancellation policy.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Intellectual Property</h2>
      <p>
        All website content, design, and branding are owned by us or our licensors. You may not
        reproduce or distribute content without written permission.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Prohibited Conduct</h2>
      <ul className="list-disc list-inside ml-4">
        <li>Uploading harmful or illegal content</li>
        <li>Violating any applicable laws</li>
        <li>Hacking or interfering with the site’s operations</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your access for violating these terms.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">8. Limitation of Liability</h2>
      <p>
        We are not liable for any indirect or incidental damages related to your use of our services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">9. Modifications</h2>
      <p>
        We may update these Terms from time to time. Your continued use of the service
        after updates means you accept the new terms.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">10. Contact Us</h2>
      <p>
        If you have questions, contact us at <a href="mailto:support@museumgo.in" className="text-blue-600 underline">support@museumgo.in</a>.
      </p>
    </div>
  );
}

export default TermsOfService;
