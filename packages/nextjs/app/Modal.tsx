import React from "react";

interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-purple-500 p-6 rounded-lg w-96 relative border-4 border-orange-500">
        <button onClick={onClose} className="absolute top-2 right-2 text-white font-bold text-xl">
          ×
        </button>
        {/* Image added here */}
        <div className="absolute top-2 left-2">
          <img src="/purplelogo.PNG" alt="Logo" className="w-10 h-10 object-contain" />
        </div>
        <br />
        <p className="text-black font-semibold text-lg mt-4">{message}</p>
      </div>
    </div>
  );
};

export default Modal;
