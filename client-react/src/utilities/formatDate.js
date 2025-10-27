export default function formatDate_d_m_y(input) {
    if (!input) 
    {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1; // Add 1 to month
        const year = today.getFullYear();

        return `${day}.${month}.${year}`;
    } else {
            // If a Date object is provided
        if (input instanceof Date && !isNaN(input)) {
            const d = input.getDate().toString().padStart(2, '0');
            const m = (input.getMonth() + 1).toString().padStart(2, '0');
            const y = input.getFullYear();
            return `${d}.${m}.${y}`;
        }

        // Expecting "YYYY-MM-DD"
        const str = String(input).trim();
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
        if (!match) return '';
        const [, year, month, day] = match;
        return `${day}.${month}.${year}`;
    }
}

// also export named for convenience
export { formatDate_d_m_y };