import React from 'react';

interface DeleteCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteCommentModal: React.FC<DeleteCommentModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
      <div className="modal-backdrop" onClick={onClose}></div>
      
      <div className="relative z-50 bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-modal-content">
        <h2 id="delete-dialog-title" className="text-xl font-bold text-slate-900">
          Delete comment
        </h2>
        <p className="text-slate-600 mt-2">
          Delete your comment permanently?
        </p>
        
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full px-4 py-3 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
