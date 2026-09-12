import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';
import { Users, Shield, CheckCircle, Clock, Eye, UserCheck, Stethoscope, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    pendingDoctors: 0
  });
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const usersRes = await axios.get('/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allUsers = usersRes.data.data?.users || [];
      setUsers(allUsers);
      
      const doctors = allUsers.filter(u => u.role === 'doctor');
      const patients = allUsers.filter(u => u.role === 'patient');
      const pending = doctors.filter(d => !d.isActive);
      
      setStats({
        totalUsers: allUsers.length,
        totalDoctors: doctors.length,
        totalPatients: patients.length,
        pendingDoctors: pending.length
      });
      
      setPendingDoctors(pending);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDoctor = async (doctorId, approve) => {
    try {
      const token = localStorage.getItem('token');
      if (approve) {
        await axios.put(`/api/auth/doctors/${doctorId}/verify`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.delete(`/api/auth/doctors/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      loadAdminData();
    } catch (error) {
      console.error('Error verifying doctor:', error);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-sky-100 text-sky-800 border border-sky-200';
      case 'doctor': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'patient': return 'bg-slate-100 text-slate-700 border border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner - Sophisticated Slate & Sky (No Red!) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-7 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-xs font-semibold mb-3 border border-sky-500/30">
            <span>🛡️ System Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Control Center</h1>
          <p className="text-slate-300 text-sm mt-1">
            Welcome back, <strong className="text-white font-semibold">{user?.name || 'Administrator'}</strong>. Oversee screening operations, clinical verifications, and user accounts.
          </p>
        </div>

        {/* Quick Cross Navigation Pills */}
        <div className="flex flex-wrap gap-2">
          <Link
            to="/doctor"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Stethoscope className="w-3.5 h-3.5 text-sky-400" />
            <span>Doctor Reviews</span>
          </Link>
          <Link
            to="/diagnose"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Test Screening</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-slate-100 p-2.5 rounded-xl">
              <Users className="h-5 w-5 text-slate-700" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalUsers}</span>
          </div>
          <p className="text-xs font-medium text-slate-500">Registered Accounts</p>
          <p className="text-[11px] text-slate-400 mt-1">Total system-wide profiles</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-sky-50 p-2.5 rounded-xl">
              <Shield className="h-5 w-5 text-sky-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalDoctors}</span>
          </div>
          <p className="text-xs font-medium text-slate-500">Medical Clinicians</p>
          <p className="text-[11px] text-slate-400 mt-1">Active ophthalmology staff</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-50 p-2.5 rounded-xl">
              <UserCheck className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalPatients}</span>
          </div>
          <p className="text-xs font-medium text-slate-500">Screening Patients</p>
          <p className="text-[11px] text-slate-400 mt-1">Eye health records logged</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-amber-50 p-2.5 rounded-xl">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.pendingDoctors}</span>
          </div>
          <p className="text-xs font-medium text-slate-500">Pending Verifications</p>
          <p className="text-[11px] text-slate-400 mt-1">Doctor credentials awaiting sign-off</p>
        </div>
      </div>

      {/* Pending Doctor Approvals */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-sky-600" />
            <span>Doctor Credentials Awaiting Verification</span>
          </h2>
          <span className="text-xs font-medium text-slate-500">
            {pendingDoctors.length} Action{pendingDoctors.length === 1 ? '' : 's'} Required
          </span>
        </div>

        {pendingDoctors.length > 0 ? (
          <div className="space-y-3">
            {pendingDoctors.map((doctor) => (
              <div key={doctor._id} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center text-sky-700 font-bold">
                      {doctor.name?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{doctor.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending Approval
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{doctor.email} • {doctor.specialization || 'Ophthalmology'}</p>
                      {doctor.phone && (
                        <p className="text-xs text-slate-400">Phone: {doctor.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVerifyDoctor(doctor._id, true)}
                      className="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Approve Credentials</span>
                    </button>
                    <button
                      onClick={() => handleVerifyDoctor(doctor._id, false)}
                      className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 text-xs font-semibold transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-sky-600" />
            <p className="text-sm font-semibold text-slate-800">All Doctor Accounts Verified</p>
            <p className="text-xs text-slate-500 mt-0.5">There are no pending doctor registration requests at this time.</p>
          </div>
        )}
      </div>

      {/* User Directory Preview */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">System Users</h2>
            <p className="text-xs text-slate-500">Live roster of patients, clinicians, and system managers</p>
          </div>
          <Link
            to="/admin/users"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
          >
            <span>Full Directory</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.slice(0, 6).map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {u.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{u.name}</p>
                        <p className="text-slate-400 text-[11px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${getRoleBadge(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      u.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
