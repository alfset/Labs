import React, { useState } from 'react';

const DropdownCard = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="max-w-sm mx-auto my-2 overflow-hidden rounded-lg shadow-lg cursor-pointer">
            <div className="px-4 py-2 bg-gray-800 text-white" onClick={() => setIsOpen(!isOpen)}>
                <h1 className="text-lg font-bold">{title}</h1>
            </div>
            {isOpen && (
                <div className="p-4 bg-white text-black">
                    <div className="flex flex-col space-y-2">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownCard;
