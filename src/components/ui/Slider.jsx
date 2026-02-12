import React from 'react';

export function Slider({
    label,
    value,
    onChange,
    min = 1,
    max = 10,
    step = 1,
    className = '',
    leftLabel = 'Niet belangrijk',
    rightLabel = 'Heel belangrijk'
}) {
    return (
        <div className={`mb-8 ${className}`}>
            <div className="flex justify-between items-center mb-3">
                {label && (
                    <label className="font-display font-semibold text-base text-gray-800">
                        {label}
                    </label>
                )}
                <span className="font-body font-medium text-lg text-blue-500">
                    {value}/{max}
                </span>
            </div>

            <div className="relative h-2 w-full bg-gray-100 rounded-full">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="
            absolute w-full h-full opacity-0 cursor-pointer z-10
          "
                />
                <div
                    className="absolute h-full bg-blue-500 rounded-full pointer-events-none"
                    style={{ width: `${((value - min) / (max - min)) * 100}%` }}
                />
                <div
                    className="absolute h-5 w-5 bg-white border-2 border-blue-500 rounded-full top-1/2 -translate-y-1/2 shadow-sm pointer-events-none transition-transform"
                    style={{ left: `${((value - min) / (max - min)) * 100}%`, transform: `translate(-50%, -50%)` }}
                />
            </div>

            <div className="flex justify-between mt-2">
                <span className="font-body text-xs text-gray-500">{leftLabel}</span>
                <span className="font-body text-xs text-gray-500">{rightLabel}</span>
            </div>
        </div>
    );
}
