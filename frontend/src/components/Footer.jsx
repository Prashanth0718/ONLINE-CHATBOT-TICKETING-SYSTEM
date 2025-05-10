import { Link } from "react-router-dom";
import { Facebook, Twitter, Github, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const navigation = {
  main: [
    { name: "About Us", href: "/about" },
    { name: "Plan & Visit", href: "/plan-visit" },
    { name: "Guide", href: "/guide" },
    { name: "Contact", href: "/contact" }
  ],
  support: [
  { name: "Terms and Services", href: "/terms-of-service" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Refund Policy", href: "/refund-policy" },
  { name: "Cookie Policy", href: "/cookie-policy" },
  ],
  social: [
    { name: "Facebook", href: "https://www.facebook.com/prashanth.sn.2003", icon: Facebook },
    { name: "Twitter", href: "https://x.com/prashanth_arya_", icon: Twitter },
    { name: "GitHub", href: "https://github.com/Prashanth0718", icon: Github },
    { name: "Instagram", href: "https://www.instagram.com/__.prashanth_kshatriyas18.__/", icon: Instagram },
  ],
  contact: [
    { icon: Mail, text: "support@museum.in" },
    { icon: Phone, text: "+91 98765 43210" },
    { icon: MapPin, text: "Available Across India, Partnered with Major Museums, Head Office: Bangalore, Karnataka - 560064" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-blue-600"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                MuseumGo
              </span>
            </Link>
            <p className="text-gray-500 text-sm">
              Experience art and culture like never before. Book your museum visits easily and explore the world of creativity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              {navigation.contact.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index} className="flex items-start space-x-3 text-gray-500">
                    <Icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm">{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} MuseumGo. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;