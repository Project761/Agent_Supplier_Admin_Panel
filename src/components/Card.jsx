import React from 'react';

export default function Card({ title, right, children }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-medium text-slate-900">{title}</h3>
                {right && <div>{right}</div>}
            </div>
            {children}
        </div>
    );
}
