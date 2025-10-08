import React from 'react';
import { useState } from 'react';

const TestForm = () => {
    const [formData,setFormData] = useState({
        firstName: '',
        lastName: '',
    });

    const handleDataChange = (e) => {
        setFormData({...formData, [e.target.name]:e.target.value})
    }

    const handleFormSubmit = (e) =>{
        e.preventDefault()
        console.log('Submited: ',formData)
    }

    return (
        <form action="" onSubmit={handleFormSubmit}>
            <hr/>
            <div>
                <label style={{margin:"5px"}} htmlFor="firstName">Name:</label>
                <input style={{margin:"5px"}} type="text" id="firstName" name="firstName" onChange={handleDataChange} value={formData.firstName}/>
            </div>
            <div>
                <label style={{margin:"5px"}} htmlFor="lastName">Surname:</label>
                <input style={{margin:"5px"}} type="text" id="lastName" name="lastName" onChange={handleDataChange} value={formData.lastName}/>
            </div>

            <button type="submit">Submit</button>
            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Dark</button>
        </form>
        
    );
};

export default TestForm;