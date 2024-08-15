import React from 'react';

const styles = {
    container: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #f5c6cb',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        marginBottom: '15px',
        fontSize: '1.5rem',
        fontWeight: '600',
    },
    list: {
        listStyleType: 'none',
        paddingLeft: '0',
    },
    listItem: {
        backgroundColor: '#f1b0b7',
        padding: '10px',
        marginBottom: '5px',
        borderRadius: '4px',
        fontSize: '1rem',
        
        transition: 'background-color 0.3s ease',
    },
    listItemHover: {
        backgroundColor: '#f8d7da',
    },
    noErrors: {
        fontSize: '1rem',
        color: '#155724',
        padding: '10px',
        borderRadius: '4px',
        textAlign: 'center', // Ajoutez cette ligne
    },
};

const Failed = ({ errors }) => {
    return (
        <div style={styles.container}>
            <h4 style={styles.heading}>No Results   </h4>
            {errors.length > 0 ? (
                <ul style={styles.list}>
                    {errors.map((error, index) => (
                        <li key={index} style={styles.listItem}>{error}</li>
                    ))}
                </ul>
            ) : (
                <p style={styles.noErrors}>No Failed Files</p>
            )}
        </div>
    );
};

export default Failed;
