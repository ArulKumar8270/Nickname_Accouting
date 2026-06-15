import type { ReactNode } from "react";

interface InputFieldProps {
    label: string;
    error?: string;
    children: ReactNode;
}

const InputField = ({ label, error, children }: InputFieldProps) => {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                {label}
            </label>
            {children}
            {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
        </div>
    );
};

export default InputField;