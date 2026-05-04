'use client'

import { useState } from 'react'
import Image from 'next/image'

// Mock Data for Applications
const MOCK_APPLICANTS = [
  {
    id: 'APP-1001',
    candidateName: 'Rahul Sharma',
    candidateEmail: 'rahul.s@example.com',
    jobTitle: 'Senior React Developer',
    appliedDate: '2023-10-15',
    status: 'under_review',
    experience: '5 Years',
    avatarUrl: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=0D8ABC&color=fff',
  },
  {
    id: 'APP-1002',
    candidateName: 'Priya Patel',
    candidateEmail: 'priya.p@example.com',
    jobTitle: 'UI/UX Designer',
    appliedDate: '2023-10-16',
    status: 'applied',
    experience: '3 Years',
    avatarUrl: 'https://ui-avatars.com/api/?name=Priya+Patel&background=F59E0B&color=fff',
  },
  {
    id: 'APP-1003',
    candidateName: 'Amit Kumar',
    candidateEmail: 'amit.k@example.com',
    jobTitle: 'Backend Python Engineer',
    appliedDate: '2023-10-14',
    status: 'shortlisted',
    experience: '6 Years',
    avatarUrl: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=10B981&color=fff',
  },
  {
    id: 'APP-1004',
    candidateName: 'Sneha Reddy',
    candidateEmail: 'sneha.r@example.com',
    jobTitle: 'Senior React Developer',
    appliedDate: '2023-10-12',
    status: 'rejected',
    experience: '4 Years',
    avatarUrl: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=EF4444&color=fff',
  },
]

export default function ApplicantsTable() {
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS)
  const [filterJob, setFilterJob] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const handleStatusChange = (id, newStatus) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    )
  }

  const uniqueJobs = ['All', ...new Set(MOCK_APPLICANTS.map((app) => app.jobTitle))]

  const filteredApplicants = applicants.filter((app) => {
    const matchesJob = filterJob === 'All' || app.jobTitle === filterJob
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesJob && matchesSearch
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'applied':
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">Applied</span>
      case 'under_review':
        return <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200">Under Review</span>
      case 'shortlisted':
        return <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">Shortlisted</span>
      case 'interview_scheduled':
        return <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">Interview</span>
      case 'accepted':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">Accepted</span>
      case 'rejected':
        return <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-medium border border-rose-200">Rejected</span>
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">Unknown</span>
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Applicants</h1>
          <p className="mt-1 text-slate-500">Track and manage candidate applications across your job posts.</p>
        </div>
        
        {/* Stats Cards in header */}
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {applicants.length}
            </div>
            <div className="text-sm font-medium text-slate-600">Total Apps</div>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
              {applicants.filter(a => a.status === 'shortlisted').length}
            </div>
            <div className="text-sm font-medium text-slate-600">Shortlisted</div>
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
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
            placeholder="Search candidates by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0">
          <select
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            className="block w-full pl-3 pr-10 py-2.5 text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm bg-slate-50 focus:bg-white transition-all"
          >
            {uniqueJobs.map((job) => (
              <option key={job} value={job}>
                {job === 'All' ? 'All Jobs' : job}
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
                  Candidate
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Applied For
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredApplicants.length > 0 ? (
                filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full border border-slate-200" src={app.avatarUrl} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{app.candidateName}</div>
                          <div className="text-sm text-slate-500">{app.candidateEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 font-medium">{app.jobTitle}</div>
                      <div className="text-xs text-slate-500">{app.experience} Exp.</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="mt-1 block w-36 pl-3 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-xs"
                      >
                        <option value="applied">Applied</option>
                        <option value="under_review">Under Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview_scheduled">Interview</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button className="mt-2 text-blue-600 hover:text-blue-900 text-xs font-medium">
                        View Profile &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-base font-medium text-slate-900">No applicants found</p>
                      <p className="text-sm">Try adjusting your search or filters.</p>
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
