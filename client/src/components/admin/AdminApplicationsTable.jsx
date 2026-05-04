'use client'

import { useState } from 'react'
import Image from 'next/image'

// Mock Data for All Platform Applications
const MOCK_ADMIN_APPLICATIONS = [
  {
    id: 'APP-5001',
    company: 'TechNova',
    jobTitle: 'Frontend Engineer',
    candidateName: 'Rahul Sharma',
    candidateEmail: 'rahul.s@example.com',
    appliedDate: '2023-10-15',
    status: 'under_review',
    resumeUrl: '#',
    avatarUrl: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=0D8ABC&color=fff',
  },
  {
    id: 'APP-5002',
    company: 'Google',
    jobTitle: 'Senior UX Designer',
    candidateName: 'Priya Patel',
    candidateEmail: 'priya.p@example.com',
    appliedDate: '2023-10-16',
    status: 'applied',
    resumeUrl: '#',
    avatarUrl: 'https://ui-avatars.com/api/?name=Priya+Patel&background=F59E0B&color=fff',
  },
  {
    id: 'APP-5003',
    company: 'TechNova',
    jobTitle: 'Backend Developer',
    candidateName: 'Amit Kumar',
    candidateEmail: 'amit.k@example.com',
    appliedDate: '2023-10-14',
    status: 'shortlisted',
    resumeUrl: '#',
    avatarUrl: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=10B981&color=fff',
  },
  {
    id: 'APP-5004',
    company: 'Amazon',
    jobTitle: 'Cloud Architect',
    candidateName: 'Sneha Reddy',
    candidateEmail: 'sneha.r@example.com',
    appliedDate: '2023-10-12',
    status: 'rejected',
    resumeUrl: '#',
    avatarUrl: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=EF4444&color=fff',
  },
  {
    id: 'APP-5005',
    company: 'Microsoft',
    jobTitle: 'AI Researcher',
    candidateName: 'Vikram Singh',
    candidateEmail: 'vikram.s@example.com',
    appliedDate: '2023-10-17',
    status: 'interview_scheduled',
    resumeUrl: '#',
    avatarUrl: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=8B5CF6&color=fff',
  },
]

export default function AdminApplicationsTable() {
  const [applications, setApplications] = useState(MOCK_ADMIN_APPLICATIONS)
  const [filterCompany, setFilterCompany] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const uniqueCompanies = ['All', ...new Set(MOCK_ADMIN_APPLICATIONS.map((app) => app.company))]

  const filteredApplications = applications.filter((app) => {
    const matchesCompany = filterCompany === 'All' || app.company === filterCompany
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCompany && matchesSearch
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'applied':
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Applied</span>
      case 'under_review':
        return <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Reviewing</span>
      case 'shortlisted':
        return <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Shortlisted</span>
      case 'interview_scheduled':
        return <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Interview</span>
      case 'accepted':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Accepted</span>
      case 'rejected':
        return <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Rejected</span>
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Unknown</span>
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Global Applications Log</h1>
          <p className="mt-1 text-slate-500">Monitor all candidate applications across the platform.</p>
        </div>
        
        {/* Stats Cards */}
        <div className="flex gap-4">
          <div className="bg-slate-900 px-4 py-2 rounded-xl shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">
              {applications.length}
            </div>
            <div className="text-sm font-medium text-slate-300">Total Apps</div>
          </div>
          <div className="bg-emerald-500 px-4 py-2 rounded-xl shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
              {uniqueCompanies.length - 1}
            </div>
            <div className="text-sm font-medium text-emerald-50">Active Co's</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 sm:text-sm transition-all"
            placeholder="Search candidates or jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0">
          <select
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            className="block w-full pl-3 pr-10 py-2.5 text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 sm:text-sm bg-slate-50 focus:bg-white transition-all font-medium text-slate-700"
          >
            {uniqueCompanies.map((company) => (
              <option key={company} value={company}>
                {company === 'All' ? 'All Companies' : company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  App ID
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Target Role
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-400">
                      {app.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <img className="h-8 w-8 rounded-full border border-slate-200" src={app.avatarUrl} alt="" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-slate-900">{app.candidateName}</div>
                          <div className="text-xs text-slate-500">{app.candidateEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 font-medium">{app.jobTitle}</div>
                      <div className="text-xs text-slate-500">at <span className="font-semibold">{app.company}</span></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button className="text-slate-400 hover:text-slate-600 transition-colors" title="View Application Log">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="text-slate-400 hover:text-rose-600 transition-colors" title="Delete Record">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-base font-medium text-slate-900">No applications found in the log</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
