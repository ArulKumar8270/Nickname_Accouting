import React from "react";

interface CommonModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function CommonModal({ title, onClose, children }: CommonModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-slate-800 font-bold text-base">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all text-lg"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}