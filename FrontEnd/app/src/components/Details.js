import React from 'react';

function Details({ successCount, No_Results_count, naCount,failed_count}) {
    return (
        <div>
            <div className="container-fluid pt-4 px-4">
                <div className="row g-4">
                    <div className="col-sm-6 col-xl-3">
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-check-circle fa-3x text-success" />
                            <div className="ms-3">
                                <p className="mb-2">Passed</p>
                                <h6 className="mb-0">{successCount}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-times-circle fa-3x text-danger" />
                            <div className="ms-3">
                                <p className="mb-2">No Results</p>
                                <h6 className="mb-0">{No_Results_count}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-question-circle fa-3x text-warning" />
                            <div className="ms-3">
                                <p className="mb-2">Failed</p>
                                <h6 className="mb-0">{failed_count}</h6> {/* Adjust or remove as needed */}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                            <i className="fa fa-exclamation-circle fa-3x text-primary" /> {/* Updated icon */}
                            <div className="ms-3">
                                <p className="mb-2">N/A</p>
                                <h6 className="mb-0">{naCount}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Details;
