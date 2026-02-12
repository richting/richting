import React from 'react';
import { motion } from 'framer-motion';

export function Button({
    children,
    variant = 'primary',
    className = '',
    loading = false,
    disabled = false,
    ...props
}) {
    const baseClasses = "px-8 py-4 rounded-xl font-body font-medium text-base transition-all duration-200 flex items-center justify-center";

    const variants = {
        primary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed",
        secondary: "bg-white text-blue-500 border-2 border-blue-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
        text: "bg-transparent text-blue-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
        accent: "bg-gradient-to-r from-coral-500 to-coral-600 text-white shadow-lg shadow-coral-500/30 hover:shadow-xl hover:shadow-coral-500/40 hover:-translate-y-0.5 active:translate-y-0"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </motion.button>
    );
}
