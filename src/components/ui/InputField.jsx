import React from 'react';

export default function InputField({
    label,
    type = 'text',
    name,
    value,
    onChange,
    error,
    placeholder,
    className = '',
    ...props
}) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                placeholder={placeholder}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
}
