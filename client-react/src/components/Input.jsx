const Input = ({
    type = "text",
    name,
    value,
    onChange,
    placeholder = "",   
    className = "",
    label = "",
    errors = null,
    ...props
}) => (
    <>
        <div>
            <div className="flex justify-between items-center">
                <label className="m-2 font-medium text-gray-900 dark:text-gray-100" htmlFor={name}>{label}</label>
                <input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`m-2 px-3 py-2 border text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-200 rounded-md focus:outline-none shadow-md focus:ring-3 focus:ring-emerald-500 ${className}`}
                    {...props}
                />
            </div>
            {errors && <div className="text-red-600 m-2 text-center text-sm">{errors}</div>}
        </div>
    </>
);

export default Input;