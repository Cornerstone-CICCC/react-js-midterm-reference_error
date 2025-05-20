"use client";

import { useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <footer className="w-full bg-gray-100 mt-12 pb-16 pd:pb-0">
      <svg width="0" height="0" aria-hidden="true" focusable="false">
        <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#f09433" offset="0%" />
          <stop stopColor="#dc2743" offset="50%" />
          <stop stopColor="#bc1888" offset="100%" />
        </linearGradient>
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-10 text-gray-600 text-sm">
        {/* Branding + Socials */}
        <div className="flex flex-col gap-4 items-center md:items-start">
          <span className="text-xl font-bold text-gray-800">Monogatari</span>
          <div className="flex gap-4 text-xl text-gray-500">
            {/* Facebook */}
            <a href="/" className="hover:text-[#1877F2] transition-colors duration-200">
              <FaFacebook />
            </a>

            {/* Instagram */}
            <a
              href="/"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="transition-colors duration-200"
            >
              <FaInstagram
                style={{
                  fill: isHovered ? "url(#instagram-gradient)" : "#6B7280", // Tailwind gray-500
                }}
              />
            </a>

            {/* Twitter */}
            <a href="/" className="hover:text-black transition-colors duration-200">
              <FaXTwitter />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <ul className="flex flex-col md:flex-row md:items-center md:gap-8 space-y-1 md:space-y-0 items-center md:items-start">
            <li>
              <a href="/" className="hover:underline">
                About us
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Careers
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Contact us
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
