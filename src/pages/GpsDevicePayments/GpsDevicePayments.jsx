import React from "react";

export default function GpsDevicePayments() {
    const handleSave = () => {
        alert("Data saved successfully ✅");
        // yahan future me API call laga sakte ho
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-[1000px] mx-auto border border-black p-5 font-sans">

            {/* Header */}
            <h2 className="text-center font-bold text-lg">
                ARUSTU TECHNOLOGY
            </h2>
            <p className="text-center text-sm">
                624 Mansarovar Plaza Jaipur
            </p>

            <div className="flex justify-between items-center my-3">
                <input
                    type="text"
                    className="border border-black px-2 py-1 text-sm"
                    placeholder="Auto Generate"
                />

                <span className="bg-yellow-300 px-4 py-1 font-semibold text-sm">
                    GPS Payment Receipt
                </span>

                <input type="date" className="border border-black px-2 py-1 text-sm" />
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-black">
                <thead>
                    <tr className="text-sm font-semibold">
                        <th className="border border-black p-2">Vehicle No</th>
                        <th className="border border-black p-2">Contact#</th>
                        <th className="border border-black p-2">Lease No</th>
                        <th className="border border-black p-2">Lease Name</th>
                        <th className="border border-black p-2">ME Office</th>
                        <th className="border border-black p-2">Payment</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <td
                                key={i}
                                className="border border-black h-[250px] p-0 align-top"
                            >
                                <textarea
                                    className="w-full h-full resize-none outline-none border-none text-sm p-2"
                                />
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-4 print:hidden">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 border border-black text-sm font-medium hover:bg-black hover:text-white transition"
                >
                    Save
                </button>

                <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-black text-white text-sm font-medium hover:opacity-80 transition"
                >
                    Print
                </button>
            </div>

        </div>
    );
}
