import { useState } from 'react';
import { IoClose } from 'react-icons/io5';

function VerificationPopup({ isOpen, onClose, onVerify }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-lg max-w-md w-[90%] p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <IoClose size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Account created</h2>
          <p className="text-gray-400">Complete identity verification to access all Vivstock services.</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Account perks</span>
            <div className="flex gap-8">
              <span>Before verification</span>
              <span>After verification</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Crypto deposits</span>
            <div className="flex gap-8">
              <span>❌</span>
              <span className="text-green-500">✓</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Crypto withdrawals</span>
            <div className="flex gap-8">
              <span>❌</span>
              <span className="text-green-500">✓</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Trading and other services</span>
            <div className="flex gap-8">
              <span>❌</span>
              <span className="text-green-500">✓</span>
            </div>
          </div>
        </div>

        <button
          onClick={onVerify}
          className="w-full bg-[#7F3DFF] text-white py-3 rounded-lg hover:bg-[#6F2FEF] transition-colors"
        >
          Verify now
        </button>

        <button
          onClick={onClose}
          className="w-full text-[#7F3DFF] mt-4 hover:underline"
        >
          Learn more here!
        </button>
      </div>
    </div>
  );
}

export default VerificationPopup;