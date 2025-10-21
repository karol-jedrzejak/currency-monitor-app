import React, { useMemo } from "react";
import PropTypes from "prop-types";

/**
 * Basic pagination component using Tailwind CSS.
 * Props:
 * - currentPage (number) - active page (1-based)
 * - totalPages (number)
 * - onPageChange (fn) - called with new page number
 * - maxButtons (number) - how many page number buttons to show (not counting first/last)
 */
export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange = () => {},
    maxButtons = 5,
}) {
    const pages = useMemo(() => {
        const result = [];

        if (totalPages <= maxButtons + 2) {
            // show all pages
            for (let i = 1; i <= totalPages; i++) result.push(i);
            return result;
        }

        const side = Math.floor(maxButtons / 2);
        let start = Math.max(2, currentPage - side);
        let end = Math.min(totalPages - 1, currentPage + side);

        // adjust when near boundaries
        const needed = maxButtons - (end - start + 1);
        if (needed > 0) {
            if (start === 2) {
                end = Math.min(totalPages - 1, end + needed);
            } else if (end === totalPages - 1) {
                start = Math.max(2, start - needed);
            } else {
                // push to whichever side has space
                if (start - 2 < totalPages - 1 - end) {
                    end = Math.min(totalPages - 1, end + needed);
                } else {
                    start = Math.max(2, start - needed);
                }
            }
        }

        result.push(1);
        if (start > 2) result.push("left-ellipsis");
        for (let i = start; i <= end; i++) result.push(i);
        if (end < totalPages - 1) result.push("right-ellipsis");
        result.push(totalPages);

        return result;
    }, [currentPage, totalPages, maxButtons]);

    const handleChange = (page) => {
        if (page === "left-ellipsis" || page === "right-ellipsis") return;
        if (page < 1 || page > totalPages) return;
        if (page === currentPage) return;
        onPageChange(page);
    };

    const btnBase =
        "px-3 py-1 rounded-md text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1";
    const activeClass = "bg-blue-600 text-white border-blue-600";
    const normalClass =
        "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700";
    const disabledClass = "opacity-50 cursor-not-allowed pointer-events-none";

    return (
        <nav aria-label="Pagination" className="flex items-center space-x-2">
            <button
                type="button"
                onClick={() => handleChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={`${btnBase} ${normalClass} ${currentPage <= 1 ? disabledClass : ""}`}
                aria-label="Previous page"
            >
                Prev
            </button>

            <ul className="flex items-center space-x-1 list-none p-0 m-0">
                {pages.map((p, idx) =>
                    typeof p === "number" ? (
                        <li key={p}>
                            <button
                                type="button"
                                onClick={() => handleChange(p)}
                                aria-current={p === currentPage ? "page" : undefined}
                                className={`${btnBase} ${p === currentPage ? activeClass : normalClass}`}
                            >
                                {p}
                            </button>
                        </li>
                    ) : (
                        <li key={`${p}-${idx}`} className="px-2 text-sm text-gray-500 select-none">
                            &hellip;
                        </li>
                    )
                )}
            </ul>

            <button
                type="button"
                onClick={() => handleChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`${btnBase} ${normalClass} ${currentPage >= totalPages ? disabledClass : ""}`}
                aria-label="Next page"
            >
                Next
            </button>
        </nav>
    );
}

Pagination.propTypes = {
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    onPageChange: PropTypes.func,
    maxButtons: PropTypes.number,
};