import React from 'react';

export function Card({ children, className = '', onClick, ...props }) {
    const Component = onClick ? 'div' : 'div';

    return (
        <Component
            onClick={onClick}
            className={`
        bg-white rounded-2xl p-6
        shadow-sm hover:shadow-md transition-shadow duration-200
        ${onClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </Component>
    );
}
