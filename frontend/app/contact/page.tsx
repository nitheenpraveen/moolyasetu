"use client";

import React from "react";

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
      <p className="text-gray-700 mb-8 text-center">
        We’d love to hear from you! Whether you have questions, feedback, or 
        partnership inquiries, MoolyaSetu is here to connect.
      </p>

      {/* Contact Information */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
        <p className="text-gray-700 mb-2">
          📧 Email: <a href="mailto:info@moolyasetu.com" className="text-blue-600 hover:underline">info@moolyasetu.com</a>
        </p>
        <p className="text-gray-700 mb-2">
          🌐 Website: <a href="https://www.moolyasetu.com" className="text-blue-600 hover:underline">www.moolyasetu.com</a>
        </p>
        <p className="text-gray-700">
          📍 Location: Anantapur, Andhra Pradesh, India
        </p>
      </div>

      {/* Contact Form Placeholder */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
        <p className="text-gray-600 mb-4">
          A contact form will be available soon. For now, please reach out via email.
        </p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
          <textarea
            placeholder="Your Message"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            disabled
          ></textarea>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
            disabled
          >
            Coming Soon
          </button>
        </form>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 mt-12 text-center">
        MoolyaSetu provides deal comparisons using affiliate links and marketplace APIs. 
        We do not sell products directly. For purchase or order issues, please contact 
        the respective marketplace (Amazon, Flipkart, or eBay).
      </p>
    </div>
  );
}
