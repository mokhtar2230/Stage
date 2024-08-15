    import React, { useState } from 'react';
    import PercentageCircle from './PercentageCircle';
    import Details from './Details';
    import Failed from './Failed';

    const UploadComponent = ({ onUpload, userId }) => {
        const [files, setFiles] = useState([]);
        const [message, setMessage] = useState('');
        const [loading, setLoading] = useState(false);
        const [successCount, setSuccessCount] = useState(0);
        const [No_Results_count, setNo_Results_count] = useState(0);
        const [naCount, setNaCount] = useState(0);
        const [failed_count, setfailed_count] = useState(0);
        const [pr, setPr] = useState(0);
        const [pr_no_Results, setPr_failure] = useState(0);
        const [pr_na, setPr_na] = useState(0);
        const [pr_failed, setpr_failed] = useState(0);
        const [outputFilePath, setOutputFilePath] = useState('');
        const [errors, setErrors] = useState([]);
        const [outputFileUrl, setOutputFileUrl] = useState('');
        const [uploadCompleted, setUploadCompleted] = useState(false);
        const [ECU, setECU] = useState([]);
        const [TC_NAME, setTC_NAME] = useState([]);  // State for TC_NAME

        const handleFileChange = (event) => {
            setFiles(event.target.files);
        };

        const handleUpload = async () => {
            if (files.length === 0) {
                setMessage('Please select files to upload.');
                return;
            }

            setLoading(true);
            try {
                const formData = new FormData();
                for (let i = 0; i < files.length; i++) {
                    formData.append('files', files[i]);
                }
                formData.append('user_id', userId);

                const response = await fetch('/upload/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                const result = await response.json();

                setMessage(result.message || 'Files uploaded successfully!');
                setSuccessCount(result.success_count || 0);
                setNo_Results_count(result.No_Results_count || 0);
                setNaCount(result.na_count || 0);
                setfailed_count(result.failed_count || 0);
                setPr(result.pr || 0);
                setPr_failure(result.pr_no_Results || 0);
                setpr_failed(result.pr_failed || 0);
                setPr_na(result.pr_na || 0);
                setOutputFilePath(result.output_file_path || '');
                setErrors(result.errors || []);
                setOutputFileUrl(result.output_file_url || '');
                setECU(result.ECU || []);
                setTC_NAME(result.TC_Name || []);  // Set TC_NAME from response
                setUploadCompleted(true);
            } catch (error) {
                setMessage('Error uploading files. Please try again.');
                setNo_Results_count(files.length);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const handleClear = () => {
            setFiles([]);
            setMessage('');
            setSuccessCount(0);
            setNo_Results_count(0);
            setNaCount(0);
            setPr(0);
            setPr_failure(0);
            setPr_na(0);
            setOutputFilePath('');
            setErrors([]);
            setECU([]);
            setTC_NAME([]);  
            setOutputFileUrl('');
            setUploadCompleted(false);
            document.querySelector('input[type="file"]').value = '';
        };

        const handleDownload = (url) => {
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'result_file.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        return (
            <>
                {loading && (
                    <div id="spinner" className="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
                        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                <div className="container-fluid position-relative d-flex p-0">
                    <div className="container-fluid pt-4 px-4">
                        <div className="bg-secondary text-center rounded p-4 mb-4">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h6 className="mb-0"></h6>
                                <a href="/" className="text-decoration-none" onClick={(e) => { e.preventDefault(); handleClear(); }}>
                                    Clear
                                </a>
                            </div>
                            <div>
                                <h1>Upload Excel Files</h1>
                                <input
                                    type="file"
                                    multiple
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange}
                                />
                                <button className="btn btn-primary mt-2" onClick={handleUpload}>Upload</button>
                                {message && (
                                    <div className="alert alert-info mt-4" role="alert">
                                        {message}
                                    </div>
                                )}
                                {outputFilePath && (
                                    <div className="mt-4">
                                        <p>Output File Path:</p>
                                        <a href={outputFilePath} target="_blank" rel="noopener noreferrer">
                                            {outputFilePath}
                                        </a>
                                        <p>URL: {outputFilePath}</p> {/* Display the URL */}
                                    </div>
                                )}
                                {outputFileUrl && (
                                    <div className="mt-4">
                                        <p>Download Result File:</p>
                                        <button className="btn btn-primary" onClick={() => handleDownload(outputFileUrl)}>
                                            Download
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {uploadCompleted && (
                            <>
                                <Details successCount={successCount} No_Results_count={No_Results_count} naCount={naCount} failed_count={failed_count} />

                                <div className="container-fluid pt-4 px-4">
                                    <div className="row g-4">
                                        <div className="col-sm-12 col-md-8 col-xl-6">
                                            <PercentageCircle Success={pr} no_Results={pr_no_Results} naCount={pr_na} ECU={ECU}  TC_NAME={TC_NAME}   pr_failed={pr_failed} />
                                        </div>
                                        <div className="col-sm-12 col-md-4 col-xl-6">
                                            <Failed errors={errors} />
                                        </div>
                                    </div>
                                </div>

                            
                            </>
                        )}
                    </div>
                </div>
            </>
        );
    };

    export default UploadComponent;
