'use client';

import React from 'react';

export default function OfferPreview({ formData }) {
    return (
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-[700px] border border-gray-200">

            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-3">
                    <img src="/assets/logo.png" alt="Company Logo" className="h-12" />
                    <div>
                        <h1 className="text-xl font-bold text-blue-600">LuxeHR Corporation</h1>
                        <p className="text-xs text-gray-500 tracking-wide">Employment Offer Letter</p>
                    </div>
                </div>

                <div className="text-sm text-gray-500">
                    Date: {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Body */}
            <div className="text-gray-700 text-sm leading-7 space-y-4">

                <p>
                    To,<br />
                    <span className="font-semibold">{formData.name || 'Candidate Name'}</span><br />
                    <span className="text-gray-500">{formData.email || 'candidate@email.com'}</span>
                </p>

                <p>Dear {formData.name || 'Candidate'},</p>

                <p>
                    We are pleased to offer you the position of{' '}
                    <span className="font-semibold">{formData.jobTitle || 'Job Title'}</span>{' '}
                    at <span className="font-semibold">LuxeHR Corporation</span>.
                </p>

                <p>
                    Your annual compensation will be{' '}
                    <span className="font-semibold text-green-600">
                        ${formData.salary || '0'}
                    </span>.
                </p>

                <p>
                    Your joining date will be{' '}
                    <span className="font-semibold">
                        {formData.joiningDate || 'DD/MM/YYYY'}
                    </span>.
                </p>

                <p>
                    We are confident that your skills and experience will be a valuable
                    addition to our company.
                </p>

                <p>We look forward to working with you.</p>

                <p>Sincerely,</p>

                {/* Signature */}
                <div className="mt-6">
                    {formData.signature ? (
                        <img
                            src={URL.createObjectURL(formData.signature)}
                            alt="Signature"
                            className="h-16 mb-2"
                        />
                    ) : (
                        <img
                            src="/assets/signature.png"
                            alt="Default Signature"
                            className="h-16 mb-2 opacity-70"
                        />
                    )}

                    <p className="font-semibold">HR Manager</p>
                    <p className="text-xs text-gray-500">LuxeHR Corporation</p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-10 border-t pt-4 text-xs text-gray-400 text-center">
                © {new Date().getFullYear()} LuxeHR Corporation • All Rights Reserved
            </div>
        </div>
    );
}
