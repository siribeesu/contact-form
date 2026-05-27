// src/pages/Dashboard.jsx
// Admin dashboard: view, search, paginate, delete messages + analytics chart

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiMail, HiTrash, HiSearch, HiLogout, HiMenuAlt2, HiX,
  HiChartBar, HiRefresh, HiEye, HiUser,
} from 'react-icons/hi';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { getContacts, deleteContact, markAsRead } from '../services/contactService';
import Spinner from '../components/Spinner';
import ConfirmModal from '../components/ConfirmModal';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ── Dashboard ──────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('messages');
  const [deleteTarget, setDeleteTarget] = useState(null); // id to delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [viewMessage, setViewMessage] = useState(null); // The message to view in full
  const searchTimer = useRef(null);

  // ── Fetch messages ──
  const fetchMessages = useCallback(async (page = 1, searchVal = search, sortVal = sort) => {
    setLoading(true);
    try {
      const data = await getContacts({ page, limit: 10, search: searchVal, sort: sortVal });
      setMessages(data.data);
      setAnalytics(data.analytics || []);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [search, sort]);

  useEffect(() => {
    fetchMessages(1);
  }, []);

  // Debounced search
  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchMessages(1, val, sort);
    }, 400);
  };

  const handleSort = (val) => {
    setSort(val);
    fetchMessages(1, search, val);
  };

  const handlePage = (page) => {
    fetchMessages(page, search, sort);
  };

  // ── Delete ──
  const confirmDelete = (id) => {
    setDeleteTarget(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteContact(deleteTarget);
      toast.success('Message deleted');
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchMessages(pagination.page);
    } catch {
      toast.error('Failed to delete message');
    }
  };

  // ── Mark as read ──
  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, isRead: true } : m));
    } catch {
      toast.error('Failed to update message');
    }
  };

  // ── Logout ──
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  // ── Chart Data ──
  const chartData = {
    labels: analytics.map((a) => a._id),
    datasets: [
      {
        label: 'Messages Received',
        data: analytics.map((a) => a.count),
        backgroundColor: 'rgba(236, 72, 153, 0.7)',
        borderColor: '#db2777',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  // ── UI ──
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-dark-800 border-r border-gray-100 dark:border-gray-700 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="She Can Foundation Logo" 
            className="w-8 h-8 object-contain drop-shadow-sm"
          />
          <div>
            <p className="font-heading font-bold text-gray-900 dark:text-white text-sm">She Can</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="p-4 mx-3 mt-4 rounded-xl bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white font-bold">
              {admin?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{admin?.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{admin?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <button
            onClick={() => { setActiveSection('messages'); setSidebarOpen(false); }}
            className={`sidebar-link w-full ${activeSection === 'messages' ? 'active' : ''}`}
          >
            <HiMail className="w-5 h-5" />
            Messages
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveSection('analytics'); setSidebarOpen(false); }}
            className={`sidebar-link w-full ${activeSection === 'analytics' ? 'active' : ''}`}
          >
            <HiChartBar className="w-5 h-5" />
            Analytics
          </button>
          <button
            onClick={() => { setActiveSection('profile'); setSidebarOpen(false); }}
            className={`sidebar-link w-full ${activeSection === 'profile' ? 'active' : ''}`}
          >
            <HiUser className="w-5 h-5" />
            Profile
          </button>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
          <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
            <HiLogout className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar backdrop (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-20 bg-white/80 dark:bg-dark-800/80 backdrop-blur border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
            <HiMenuAlt2 className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading text-xl font-bold text-gray-900 dark:text-white">
              {activeSection === 'messages' ? 'Messages' : activeSection === 'analytics' ? 'Analytics' : 'Profile'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">She Can Foundation Admin Dashboard</p>
          </div>
          <button
            onClick={() => fetchMessages(pagination.page)}
            className="ml-auto p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            title="Refresh"
          >
            <HiRefresh className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* ── Stats Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="stats-card">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 text-xl">
                📬
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Messages</p>
                <p className="text-2xl font-bold font-heading text-gray-900 dark:text-white">{pagination.total}</p>
              </div>
            </div>
            <div className="stats-card">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xl">
                🔔
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Unread</p>
                <p className="text-2xl font-bold font-heading text-gray-900 dark:text-white">{unreadCount}</p>
              </div>
            </div>
            <div className="stats-card">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
                📄
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">This Page</p>
                <p className="text-2xl font-bold font-heading text-gray-900 dark:text-white">
                  {pagination.page}/{pagination.totalPages}
                </p>
              </div>
            </div>
          </div>

          {/* ── Messages Section ── */}
          {activeSection === 'messages' && (
            <div className="space-y-4">
              {/* Search + Sort */}
              <div className="card flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or subject..."
                    className="input-field pl-10"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    id="search-messages"
                  />
                </div>
                <select
                  value={sort}
                  onChange={(e) => handleSort(e.target.value)}
                  className="input-field w-auto min-w-[140px]"
                  id="sort-messages"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* Table */}
              <div className="card p-0 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Spinner size="lg" text="Loading messages..." />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-16">
                    <span className="text-5xl block mb-4">📭</span>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No messages found</p>
                    {search && <p className="text-sm text-gray-400 mt-1">Try clearing your search</p>}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Mobile Card View (Hidden on medium/large screens) */}
                    <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
                      {messages.map((msg, idx) => (
                        <div key={`mob-${msg._id}`} className={`p-4 ${!msg.isRead ? 'bg-pink-50/40 dark:bg-pink-900/10' : ''}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0"></span>}
                              <h3 className="font-bold text-gray-900 dark:text-white">{msg.name}</h3>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 space-y-1">
                            <p><a href={`mailto:${msg.email}`} className="text-primary-500">{msg.email}</a></p>
                            <p className="font-medium text-gray-700 dark:text-gray-300 truncate">{msg.subject}</p>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <button
                              onClick={() => {
                                setViewMessage(msg);
                                if (!msg.isRead) handleMarkRead(msg._id);
                              }}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => confirmDelete(msg._id)}
                              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table View (Hidden on mobile screens) */}
                    <table className="data-table hidden md:table w-full">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Subject</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map((msg, idx) => (
                          <tr key={msg._id} className={!msg.isRead ? 'bg-pink-50/40 dark:bg-pink-900/10' : ''}>
                            <td className="font-medium text-gray-500">
                              {(pagination.page - 1) * 10 + idx + 1}
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                {!msg.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0"></span>
                                )}
                                <span className="font-medium text-gray-900 dark:text-white">{msg.name}</span>
                              </div>
                              <p className="text-xs text-gray-400">{msg.phone}</p>
                            </td>
                            <td>
                              <a href={`mailto:${msg.email}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                                {msg.email}
                              </a>
                            </td>
                            <td>
                              <p className="max-w-[200px] truncate" title={msg.subject}>{msg.subject}</p>
                              <p className="text-xs text-gray-400 max-w-[200px] truncate" title={msg.message}>
                                {msg.message}
                              </p>
                            </td>
                            <td className="whitespace-nowrap text-gray-500 text-xs">
                              {new Date(msg.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric',
                              })}
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      setViewMessage(msg);
                                      if (!msg.isRead) handleMarkRead(msg._id);
                                    }}
                                    title="View full message"
                                    className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                  >
                                    <HiEye className="w-4 h-4" />
                                  </button>
                                <button
                                  onClick={() => confirmDelete(msg._id)}
                                  title="Delete message"
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                  id={`delete-${msg._id}`}
                                >
                                  <HiTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePage(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm"
                  >
                    ← Prev
                  </button>
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        pagination.page === i + 1
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-glow'
                          : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePage(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Analytics Section ── */}
          {activeSection === 'analytics' && (
            <div className="card">
              <h2 className="font-heading font-bold text-gray-900 dark:text-white text-lg mb-2">Messages (Last 7 Days)</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Daily contact form submissions over the last week.</p>
              {analytics.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <HiChartBar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No analytics data yet</p>
                </div>
              ) : (
                <div style={{ height: '320px' }}>
                  <Bar data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                </div>
              )}
            </div>
          )}

          {/* ── Profile Section ── */}
          {activeSection === 'profile' && (
            <div className="card max-w-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white text-2xl font-bold shadow-glow">
                  {admin?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white">{admin?.username}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">{admin?.role}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                  <HiMail className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{admin?.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
                  <HiUser className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">Role: {admin?.role}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Message?"
        message="This will permanently delete the contact message. This action cannot be undone."
      />

      {/* View Message Modal */}
      {viewMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <HiMail className="text-primary-500 w-5 h-5" />
                Message Details
              </h3>
              <button 
                onClick={() => setViewMessage(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">From</p>
                <p className="font-medium text-gray-900 dark:text-white">{viewMessage.name} <span className="text-gray-500 dark:text-gray-400 font-normal">({viewMessage.email})</span></p>
                {viewMessage.phone && <p className="text-sm text-gray-500 dark:text-gray-400">{viewMessage.phone}</p>}
              </div>
              
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(viewMessage.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Subject</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{viewMessage.subject}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Message</p>
                <div className="p-4 bg-gray-50 dark:bg-dark-900 rounded-xl text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed border border-gray-100 dark:border-gray-700">
                  {viewMessage.message}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-800 flex justify-end">
              <button 
                onClick={() => setViewMessage(null)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
