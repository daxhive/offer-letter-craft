'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import { 
  ArrowLeft, 
  Send, 
  Save, 
  User, 
  Briefcase, 
  DollarSign, 
  Calendar,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function CreateOfferPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    jobTitle: '',
    salary: '',
    joiningDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, shouldSend = false) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/offers', formData);
      
      if (shouldSend) {
        await api.put(`/offers/${data._id}/status`, { status: 'SENT' });
      }
      
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create offer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Offer</h1>
        <p className="text-gray-500">Fill in the details below to generate a professional offer letter.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="premium-card p-8 bg-white">
          <form className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Candidate Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="candidateName"
                  required
                  value={formData.candidateName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Candidate Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="candidateEmail"
                  required
                  value={formData.candidateEmail}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="jobTitle"
                  required
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Senior Software Engineer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Annual Salary ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="salary"
                    required
                    value={formData.salary}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="120000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Joining Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="joiningDate"
                    required
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex space-x-4">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={loading}
                className="flex-1 flex justify-center items-center py-3 px-4 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading}
                className="flex-1 flex justify-center items-center py-3 px-4 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Offer
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Section */}
        <div className="space-y-4">
          <div className="flex items-center text-sm font-bold text-gray-500 uppercase tracking-wider">
            <Eye className="w-4 h-4 mr-2" />
            Live Preview
          </div>
          <div className="premium-card p-10 bg-white min-h-[500px] border-dashed border-2 border-gray-200 shadow-none">
            <div className="text-center mb-10 pb-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-blue-600">LuxeHR Corporation</h2>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Acceptance of Employment</p>
            </div>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-sm">Date: <span className="font-semibold">{new Date().toLocaleDateString()}</span></p>
              
              <div className="space-y-1">
                <p className="text-sm">To,</p>
                <p className="text-md font-bold text-gray-900">{formData.candidateName || '[Candidate Name]'}</p>
                <p className="text-sm text-gray-500">{formData.candidateEmail || '[Candidate Email]'}</p>
              </div>

              <p className="text-sm">
                Dear {formData.candidateName || 'Candidate'},
              </p>

              <p className="text-sm">
                We are delighted to offer you the position of <strong>{formData.jobTitle || '[Job Title]'}</strong> at LuxeHR. 
                Your Annual Compensation will be <strong>${formData.salary ? Number(formData.salary).toLocaleString() : '[Amount]'}</strong>.
              </p>

              <p className="text-sm">
                Expected Joining Date: <strong>{formData.joiningDate ? new Date(formData.joiningDate).toLocaleDateString() : '[Select Date]'}</strong>
              </p>

              <p className="text-sm mt-10 italic text-gray-400">
                This is a preview. The final offer letter will include legal terms and signature blocks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
