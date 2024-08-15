import React from 'react';

const FileDownloader = () => {
    const handleDownload = async () => {
        try {
            const response = await fetch('/download/yourfile.pdf', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/pdf',
                },
            });

            if (!response.ok) {
                throw new Error('File download failed');
            }

            // Create a Blob from the response and create a download link
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'yourfile.pdf'; // Change the filename as needed
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <button onClick={handleDownload}>Download File</button>
    );
};

export default FileDownloader;
