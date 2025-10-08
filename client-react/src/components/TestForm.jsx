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
        </form>
    );
};

export default TestForm;