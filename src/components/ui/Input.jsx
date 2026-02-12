import React from 'react';

export function Input({
    label,
    value,
    onChange,
    error,
    className = '',
    id,
    ...props
}) {
    return (
        <div className={`mb-5 ${className}`}>
            {label && (
                <label htmlFor={id} className="block font-body font-medium text-sm text-gray-800 mb-2 tracking-wide">
                    {label}
                </label>
            )}

            <input
                id={id}
                value={value}
                onChange={onChange}
                className={`
          w-full bg-white border-2 rounded-lg py-3.5 px-4
          font-body text-base text-gray-800
          placeholder:text-gray-400
          transition-colors duration-200
          focus:outline-none focus:ring-4 focus:ring-blue-100
          ${error
                        ? 'border-coral-500 focus:border-coral-600'
                        : 'border-gray-100 focus:border-blue-500'
                    }
        `}
                {...props}
            />

            {error && (
                <p className="font-body text-xs text-coral-500 mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}
