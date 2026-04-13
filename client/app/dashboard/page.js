'use client';

import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { 
  Users, 
  FileCheck, 
  Clock, 
  TrendingUp, 
  Search, 
  Filter,
  MoreVertical,
  ChevronRight,
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
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <p className="text-gray-500 text-sm">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            <Download className="w-4 h-4" />
            <span>Export Reports</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="premium-card overflow-hidden bg-white">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Offer Letters</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <Filter className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Role & Salary</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Created</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-8 h-20 bg-gray-50/20"></td>
                  </tr>
                ))
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">
                    No offer letters found. Create your first one!
                  </td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer._id} className="hover:bg-gray-50/80 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                          {offer.candidateName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{offer.candidateName}</p>
                          <p className="text-xs text-gray-500">{offer.candidateEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{offer.jobTitle}</p>
                      <p className="text-xs text-gray-500">${offer.salary.toLocaleString()} / yr</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={offer.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(offer.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {offers.length > 0 && (
          <div className="p-4 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between text-sm">
            <p className="text-gray-500">Showing {offers.length} entries</p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg disabled:opacity-50">Prev</button>
              <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
