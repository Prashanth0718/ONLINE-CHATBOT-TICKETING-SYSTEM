import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Info */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-3">🎟️ TicketBooking</h3>
          <p className="text-sm">
            Book tickets to your favorite museums with ease and multilingual support. Secure. Simple. Smart.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/museums" className="hover:text-white transition">Museums</a></li>
            <li><a href="/profile" className="hover:text-white transition">My Account</a></li>
            <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-3">Follow Us</h4>
          <div className="flex space-x-4 text-lg">
            <a href="#" className="hover:text-blue-400 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-sky-400 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-pink-400 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-300 transition"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-500 text-center">
        © 2025 TicketBooking. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
