const Button = ({ onClick, children, type = "button", disabled = false, className = "" }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
                cursor-pointer
                px-3 py-2
                rounded-xl
                font-medium
                border-1 border-emerald-500 dark:border-emerald-400
                text-gray-700 bg-emerald-100
                dark:text-gray-900 dark:bg-emerald-700
                hover:bg-emerald-300
                hover:shadow-md
                dark:hover:bg-emerald-400
                dark:shadow-emerald-900
                ${className}`}
    >
        {children}
    </button>
);

export default Button;