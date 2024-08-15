// RolesList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Function to get roles from the backend
const getRoles = async () => {
    try {
        const response = await axios.get('/roles');
        return response.data.roles;  // Assuming the API response has a `roles` property
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;  // Rethrow the error for handling in the component
    }
};

// Component to display the list of roles
const RolesList = () => {
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesData = await getRoles();
                setRoles(rolesData);
            } catch (error) {
                console.error('Failed to load roles:', error.message);
                setError('Failed to load roles.');
            }
        };

        fetchRoles();
    }, []);  // Empty dependency array means this effect runs once on mount

    return (
        <div>
            <h2>Roles</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {roles.length > 0 ? (
                    roles.map((role, index) => (
                        <li key={index}>{role}</li>
                    ))
                ) : (
                    <li>No roles found</li>
                )}
            </ul>
        </div>
    );
};

export default RolesList;
