import React from "react";

interface InputFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export default function InputField({ label, error, children }: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs font-medium mt-1">{error}</p>
      )}
    </div>
  );
}