import React from "react";

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">Refund Policy</h1>
      <p className="mb-4">
        At <strong>MuseumGo.in</strong>, we strive to provide the best ticketing experience for all visitors. However, we understand that plans may change.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Eligibility for Refund</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Refunds are applicable only for cancellations made at least 24 hours before the scheduled visit.</li>
        <li>Tickets booked through our chatbot can be cancelled by using the "Cancel Ticket" option.</li>
        <li>Refunds are not issued for missed visits or no-shows.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Refund Process</h2>
      <p className="mb-4">
        Refunds will be processed to the original mode of payment within 7–10 business days after successful cancellation. You will receive a confirmation email once the refund is initiated.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Need Help?</h2>
      <p>
        For refund-related queries, contact us at <a href="mailto:support@museumgo.in" className="text-indigo-600 hover:underline">support@museumgo.in</a>
      </p>
    </div>
  );
};

export default RefundPolicy;
