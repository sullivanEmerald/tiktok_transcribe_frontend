import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="">
                {label && (
                    <label className="block mb-1 text-md font-medium text-foreground">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`w-full border-1 border-gray-700 focus:ring-gray-700 focus:ring-1 rounded-lg px-2 py-2.5 text-muted-foreground  placeholder:text-muted-foreground placeholder:text-sm bg-transparent ${className}`}
                    {...props}
                />
                {error && (
                    <span className="text-xs text-red-500 mt-1 block">{error}</span>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
