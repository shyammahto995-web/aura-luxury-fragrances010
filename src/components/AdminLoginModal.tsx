import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(password);
    setLoading(false);

    if (res.success) {
      setPassword('');
      onSuccess();
      onClose();
    } else {
      setError(res.error || 'Invalid credentials.');
    }
  };

  return (
    <div id="aura-admin-login-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md bg-[#FAF8F5] border border-[#E0D7C9] shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#ECE4D8]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#141312] text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#141312] font-semibold">Atelier Admin Portal</h3>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8A8174]">Internal Management</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#666054] hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <p className="text-xs text-[#5C5549] leading-relaxed">
            Please enter your administrator passkey to manage catalog formulations, inventory, order fulfillments, and sales analytics.
          </p>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
              Admin Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8173]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-white border border-[#DDD4C5] pl-9 pr-3.5 py-2.5 text-xs text-[#141312] focus:outline-none focus:border-[#141312]"
                autoFocus
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#141312] text-white hover:bg-[#2B2824] text-xs uppercase tracking-[0.2em] font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
            </button>
          </div>

          <p className="text-[10px] text-center text-[#8C8476] pt-2">
            Default initial credential: <code className="bg-[#EFE9E0] px-1.5 py-0.5 font-mono text-[#141312]">14301430</code>
          </p>
        </form>
      </div>
    </div>
  );
};
