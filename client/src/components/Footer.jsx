// src/components/Footer.jsx
// Footer with real She Can Foundation data

import { Link } from 'react-router-dom';
import {
  FaFacebook, FaInstagram, FaLinkedin, FaYoutube,
} from 'react-icons/fa';
import { HiMail, HiPhone, HiGlobe } from 'react-icons/hi';

const Footer = () => {
  const year = new Date().getFullYear();

  // Real social links from shecanfoundation.org
  const socialLinks = [
    { icon: FaInstagram,  href: 'https://www.instagram.com/_shecanfoundation_', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: FaLinkedin,   href: 'https://www.linkedin.com/company/shecanfoundation', label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: FaFacebook,   href: 'https://www.facebook.com/shecanfoundation', label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: FaYoutube,    href: 'https://www.youtube.com/@shecanfoundation', label: 'YouTube', color: 'hover:text-red-500' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin Login', path: '/admin/login' },
  ];

  return (
    <footer className="bg-navy-900 dark:bg-navy-900 text-navy-300 mt-auto">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <span className="font-heading font-bold text-xl text-white">
                She Can <span className="gradient-text">Foundation</span>
              </span>
            </div>
            <p className="text-navy-400 text-sm leading-relaxed">
              NGO Registered under the Indian Society Act, 1860. Empowering women and transforming lives — together, we can break down barriers and create a world where every woman has the opportunity to thrive and succeed.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`text-navy-500 ${color} transition-all duration-200 transform hover:scale-110`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-navy-400 hover:text-brand-400 transition-colors duration-200 flex items-center gap-2 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
              {/* External real website link */}
              <li>
                <a
                  href="https://shecanfoundation.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy-400 hover:text-brand-400 transition-colors duration-200 flex items-center gap-2 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0"></span>
                  Official Website ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info — Real data from shecanfoundation.org */}
          <div>
            <h3 className="font-heading font-semibold text-white text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-navy-400">
                <HiMail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="mailto:president@shecanfoundation.org" className="hover:text-brand-400 transition-colors break-all">
                  president@shecanfoundation.org
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-navy-400">
                <HiPhone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="tel:+918283841830" className="hover:text-brand-400 transition-colors">
                  +91-8283841830
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-navy-400">
                <HiGlobe className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a
                  href="https://shecanfoundation.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-400 transition-colors"
                >
                  shecanfoundation.org
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-navy-800">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500 text-center sm:text-left">
          <p>© {year} She Can Foundation. All rights reserved.</p>
          <p>
            Founded by <span className="text-brand-400 font-medium">Reeta Mishra</span> · Govt. Reg. NGO under Indian Society Act, 1860
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
