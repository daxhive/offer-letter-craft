'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/api';
import SignaturePad from '../../../components/Portal/SignaturePad';
import { 
  Download, 
  ChevronRight, 
  MapPin, 
  Calendar,
  Clock,
  Briefcase,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

export default function CandidatePortal() {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignModal, setShowSignModal] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOffer();
  }, [id]);

  const fetchOffer = async () => {
    try {
      const { data } = await api.get(`/offers/portal/${id}`);
      setOffer(data);
      if (data.status === 'SIGNED') setIsSigned(true);
    } catch (err) {
      setError('Offer not found or link has expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (signatureDataUrl) => {
    try {
      await api.post(`/offers/portal/${id}/sign`, { signature: signatureDataUrl });
      setIsSigned(true);
      setShowSignModal(false);
      fetchOffer(); // Refresh data
    } catch (err) {
      alert('Error signing document. Please try again.');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/offers/${offer._id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `OfferLetter_${offer.candidateName}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="animate-pulse text-blue-600 font-bold">LOADING PORTAL...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 text-center">
      <div className="premium-card p-10 max-w-md">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
        <p className="text-gray-500 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="text-blue-600 font-bold underline">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="font-black text-xl text-gray-900 tracking-tight">LuxeHR Portal</span>
          </div>
          {isSigned && (
            <button 
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-10 px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8 animate-fade-in">
          {/* Welcome Message */}
          <section className="premium-card p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <h1 className="text-3xl font-bold mb-2">Congratulations, {offer.candidateName}!</h1>
            <p className="text-blue-100 opacity-90">We're thrilled to offer you the role of <strong>{offer.jobTitle}</strong>. Please review the details below and sign to accept your offer.</p>
          </section>

          {/* Status Tracker */}
          <div className="flex items-center space-x-4 px-2">
            <div className="flex items-center space-x-2 text-green-600 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Sent</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <div className={`flex items-center space-x-2 font-bold text-sm ${isSigned ? 'text-green-600' : 'text-blue-600'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isSigned ? 'bg-green-100' : 'bg-blue-100'}`}>
                {isSigned ? <CheckCircle2 className="w-4 h-4" /> : '2'}
              </div>
              <span>Signing</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <div className={`text-sm font-bold ${isSigned ? 'text-blue-600 animate-pulse' : 'text-gray-300'}`}>
              <span>Onboarding</span>
            </div>
          </div>

          {/* Offer Letter Content */}
          <div className="premium-card bg-white p-12 shadow-sm border border-gray-100 font-serif">
            <div className="text-center mb-16 border-b border-gray-100 pb-10">
              <h2 className="text-2xl font-black text-blue-600 tracking-tighter uppercase mb-2">{offer.companyName}</h2>
              <p className="text-gray-400 font-sans uppercase text-[10px] tracking-[0.3em]">Official Letter of Appointment</p>
            </div>

            <div className="space-y-8 text-gray-800 text-lg leading-relaxed">
              <div className="flex justify-between font-sans text-sm text-gray-500 mb-10">
                <span>REF: LUXE/2026/OFFER</span>
                <span>Date: {format(new Date(offer.createdAt), 'MMMM dd, yyyy')}</span>
              </div>

              <p>Dear {offer.candidateName},</p>
              
              <p>
                We are extremely pleased to offer you the position of <strong>{offer.jobTitle}</strong> at {offer.companyName}. 
                During our interview process, we were very impressed by your skills and achievements, and we believe 
                your background will be a significant asset to our mission.
              </p>

              <div className="bg-gray-50 p-6 rounded-2xl font-sans text-base space-y-3 border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Annual Compensation</span>
                  <span className="font-bold text-gray-900">${offer.salary.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Joining Date</span>
                  <span className="font-bold text-gray-900">{format(new Date(offer.joiningDate), 'MMMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Work Location</span>
                  <span className="font-bold text-gray-900">Remote / Global</span>
                </div>
              </div>

              <p>
                As a valued member of our team, you will contribute directly to the growth of our HR Automation platforms. 
                We look forward to your contributions and being part of our innovative culture.
              </p>

              <p>
                To accept this offer, please digitally sign this document. We look forward to welcoming you aboard!
              </p>

              <div className="pt-10 flex justify-end">
                <div className="text-center">
                  <p className="text-sm font-sans text-gray-500 mb-4">Candidate Signature</p>
                  {isSigned ? (
                    <div className="text-center">
                      <img src={offer.signature} className="h-20 max-w-[200px] mx-auto grayscale brightness-75 transition-all hover:grayscale-0" alt="signature" />
                      <div className="w-40 border-t border-gray-300 mt-2 mx-auto"></div>
                      <p className="text-xs font-sans text-gray-400 mt-2">Signed on {format(new Date(offer.signedAt), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowSignModal(true)}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-all text-sm"
                    >
                      Click here to Sign
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="premium-card p-6 bg-white border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-3 text-blue-600" />
              Offer Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Briefcase className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Position</p>
                  <p className="text-sm font-bold text-gray-900">{offer.jobTitle}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Joining Date</p>
                  <p className="text-sm font-bold text-gray-900">{format(new Date(offer.joiningDate), 'MMMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Work Mode</p>
                  <p className="text-sm font-bold text-gray-900">Remote / Headquarters</p>
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card p-6 bg-blue-50/50 border border-blue-100 border-dashed">
            <h3 className="font-bold text-blue-900 mb-2">Need help?</h3>
            <p className="text-sm text-blue-700 mb-4 opacity-80">If you have any questions regarding your offer letter, please contact our talent team.</p>
            <a href="mailto:talent@luxehr.com" className="text-sm font-black text-blue-700 underline">talent@luxehr.com</a>
          </div>
        </div>
      </main>

      {/* Signature Modal */}
      {showSignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden animate-fade-in scale-in">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Digital Signature</h2>
                <p className="text-sm text-gray-500">Please provide your signature to accept the offer.</p>
              </div>
              <button 
                onClick={() => setShowSignModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                ✕
              </button>
            </div>
            <div className="p-8">
              <SignaturePad 
                candidateName={offer.candidateName} 
                onSave={handleSign}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
