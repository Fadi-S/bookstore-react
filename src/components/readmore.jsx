import React, { useState } from 'react';

export default function ReadMore ({ text, maxLength = 100, disabled = false }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    const shouldTruncate = text.length > maxLength;
    const displayedText = isExpanded || !shouldTruncate ? text : `${text.slice(0, maxLength)}...`;

    return (
        <div>
            <p className="mt-1">
                {displayedText}
            </p>
            {shouldTruncate && !disabled && (
                <button onClick={toggleReadMore} className="text-blue-500 hover:underline mt-1">
                    {isExpanded ? 'Read Less' : 'Read More'}
                </button>
            )}
        </div>
    );
}
