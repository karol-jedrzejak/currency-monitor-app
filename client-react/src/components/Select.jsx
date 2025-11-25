import React from "react";

const Select = ({
    children,
    id,
    name,
    options,
    onChange,  
    className = "",
    label = "",
    errors = null,
    ...props
}) => (
    <>
        <div>
            <div className="flex justify-between items-center">
                <label className="m-2 font-medium text-gray-900 dark:text-gray-100" htmlFor={name}>{label}</label>
                <select
                    {...(id && (id=id))}
                    className={`m-2 px-3 py-2 border dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-200 rounded-md focus:outline-none shadow-md focus:ring-3 focus:ring-emerald-500 ${className}`}
                    name={name}
                    onChange={onChange}
                    {...props}
                >
                    {children}
                </select>
            </div>
            {errors && <div className="text-red-600 m-2 text-center text-sm">{errors}</div>}
        </div>
    </>
);

export default Select;