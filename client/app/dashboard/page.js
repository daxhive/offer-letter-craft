'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import {
  Users,
  FileCheck,
  Clock,
  TrendingUp,
  MoreVertical,
  Download
} from 'lucide-react';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="premium-card p-6 flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {trend && (
        <p className="text-xs text-green-600 mt-2 flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend} this month
        </p>
      )}
    </div>
    <div className={`p-4 rounded-2xl ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    DRAFT: 'bg-gray-100 text-gray-600 border-gray-200',
    SENT: 'bg-blue-50 text-blue-600 border-blue-100',
    SIGNED: 'bg-green-50 text-green-600 border-green-100',
    REJECTED: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const { data } = await api.get('/offers');
      setOffers(data);
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuToggle = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  // ✅ DELETE FUNCTION
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this offer?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/offers/${id}`);
      setOffers((prev) => prev.filter((offer) => offer._id !== id));
      alert("Offer deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete offer");
    }
  };

  const stats = [
    { title: 'Total Offers', value: offers.length, icon: Users, color: 'bg-blue-600', trend: '+12%' },
    { title: 'Pending Sign', value: offers.filter(o => o.status === 'SENT').length, icon: Clock, color: 'bg-amber-500', trend: '+5%' },
    { title: 'Signed Offers', value: offers.filter(o => o.status === 'SIGNED').length, icon: FileCheck, color: 'bg-emerald-500', trend: '+18%' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experience Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back!</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white border rounded-xl text-sm">
          <Download className="w-4 h-4" />
          <span>Export Reports</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="premium-card bg-white">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-lg font-bold">Recent Offer Letters</h2>
        </div>

        <table className="w-full">
          <tbody>
            {offers.map((offer) => (
              <tr key={offer._id} className="border-b">
                <td className="px-6 py-4">{offer.candidateName}</td>
                <td>{offer.jobTitle}</td>
                <td><StatusBadge status={offer.status} /></td>
                <td>
                  {offer.createdAt
                    ? format(new Date(offer.createdAt), 'MMM dd, yyyy')
                    : '-'}
                </td>

                <td className="relative text-right pr-6">
                  <button
                    onClick={() => handleMenuToggle(offer._id)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenu === offer._id && (
                    <div className="absolute right-6 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">

                      <button
                        onClick={() => {
                          router.push(`/dashboard/offers/${offer._id}`);
                          setActiveMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        View
                      </button>

                      <button
                        onClick={() => {
                          alert('Send functionality coming soon');
                          setActiveMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Send
                      </button>

                      <button
                        onClick={() => {
                          window.open(`http://localhost:5000/api/offers/${offer._id}/download`);
                          setActiveMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Download
                      </button>

                      {/* 🔴 DELETE BUTTON */}
                      <button
                        onClick={() => {
                          handleDelete(offer._id);
                          setActiveMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {offers.length === 0 && !loading && (
          <p className="p-6 text-center text-gray-500">No offers found</p>
        )}
      </div>
    </div>
  );
}
