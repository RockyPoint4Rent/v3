import { useState } from 'react';
import { Waves, Eye, EyeOff, AlertCircle } from 'lucide-react';

type Props = {
  onSignIn: (email: string, password: string) => Promise<Error | null>;
};

export default function AdminLogin({ onSignIn }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    const err = await onSignIn(email, password);
    if (err) setError(err.message || 'Invalid credentials. Please try again.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-deep mb-4">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-serif text-2xl text-white font-light mb-1">Owner Dashboard</h1>
          <p className="font-sans text-sm text-slate-400 font-light">Rocky Point 4 Rent</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8">
          {error && (
            <div className="flex items-start gap-2 bg-red-950/50 border border-red-800 px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="font-sans text-sm text-red-300 font-light">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-slate-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="Reservations@rockypoint4rent.com"
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 font-sans text-sm px-4 py-3 focus:outline-none focus:border-teal-mid transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 font-sans text-sm px-4 py-3 pr-11 focus:outline-none focus:border-teal-mid transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-150"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-deep text-white font-sans text-sm font-medium tracking-widest uppercase py-3.5 hover:bg-teal-mid transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="font-sans text-xs text-slate-500 text-center font-light leading-relaxed">
              First time? Create an account via Supabase Auth, then return here to sign in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
