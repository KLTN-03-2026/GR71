import React from 'react';

function CustomButton({ text }) {
    return (
        <button className="flex items-center gap-2 bg-[#FF3B2F] text-white px-5 py-2 rounded-full shadow-md hover:bg-red-600 transition cursor-pointer">
            {text}
        </button>
    );
}

export default CustomButton;
