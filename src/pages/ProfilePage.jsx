import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');

  const [profile, setProfile] = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const showMsg = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(''); }
    else { setSuccess(msg); setError(''); }
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(profile);
      updateUser(data.user);
      showMsg('Profile updated successfully!');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to update profile', true);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return showMsg('New passwords do not match', true);
    }
    if (passwords.newPassword.length < 6) {
      return showMsg('Password must be at least 6 characters', true);
    }
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMsg('Password changed successfully!');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to change password', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Profile Settings</h1>
        <p className="text-textSecondary mt-1">Manage your account information</p>
      </div>

      {/* Avatar */}
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden">
          {profile.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-textPrimary text-lg">{user?.name}</p>
          <p className="text-textSecondary text-sm">{user?.email}</p>
          <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary capitalize">{user?.role}</span>
        </div>
      </div>

      {/* Success/Error */}
      {success && <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl flex items-center gap-2"><span>✅</span>{success}</div>}
      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2"><span>❌</span>{error}</div>}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['profile', 'password'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${tab === t ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-primary'}`}>
            {t === 'profile' ? '👤 Profile' : '🔐 Password'}
          </button>
        ))}
      </div>

      {/* Profile Form */}
      {tab === 'profile' && (
        <form onSubmit={handleProfileSave} className="card space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              className="input-field" placeholder="Your name" required />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" value={user?.email} className="input-field bg-gray-50 cursor-not-allowed" disabled />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="label">Avatar URL</label>
            <input type="url" value={profile.avatar} onChange={e => setProfile(p => ({ ...p, avatar: e.target.value }))}
              className="input-field" placeholder="https://example.com/avatar.jpg" />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              rows={3} className="input-field resize-none"
              placeholder="Tell readers a little about yourself..." maxLength={500} />
            <p className="text-xs text-gray-400 mt-1 text-right">{profile.bio.length}/500</p>
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : '💾 Save Profile'}
          </button>
        </form>
      )}

      {/* Password Form */}
      {tab === 'password' && (
        <form onSubmit={handlePasswordSave} className="card space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input type="password" value={passwords.currentPassword}
              onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
              className="input-field" placeholder="Enter current password" required />
          </div>
          <div>
            <label className="label">New Password</label>
            <input type="password" value={passwords.newPassword}
              onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
              className="input-field" placeholder="Min 6 characters" required />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" value={passwords.confirmPassword}
              onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
              className="input-field" placeholder="Repeat new password" required />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Changing...</> : '🔐 Change Password'}
          </button>
        </form>
      )}
    </div>
  );
}
