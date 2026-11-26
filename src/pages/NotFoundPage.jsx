import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

/**
 * Custom 404 Not Found Page (White & Emerald Theme)
 */
export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 font-extrabold text-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
          404
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6">
          The requested page does not exist or has been moved. Check the URL or return to the candidate dashboard.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard')}
            icon={<Home className="w-4 h-4" />}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Landing Page
          </Button>
        </div>
      </div>
    </div>
  );
}
