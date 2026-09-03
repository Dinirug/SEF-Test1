import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import ErrorAlert from '../components/ErrorAlert';
import { User, Mail, Lock, UserPlus, CheckCircle2, Phone, Calendar } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [clientError, setClientError] = useState('');
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Real-time password validation helpers
  const isMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isMatching = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientError('');

    if (!fullName.trim()) {
      setClientError('Full Name is required.');
      return;
    }

    if (!email.trim()) {
      setClientError('Email is required.');
      return;
    }

    if (email.trim().toLowerCase() === 'admin@gmail.com') {
      setClientError('Admin registration is not allowed.');
      return;
    }

    if (!isMinLength || !hasUpper || !hasLower || !hasNumber) {
      setClientError('Password must be at least 8 characters with uppercase, lowercase, and a number.');
      return;
    }

    if (!isMatching) {
      setClientError('Passwords do not match.');
      return;
    }

    // Phone validation — exactly 10 digits
    const phoneDigits = phoneNumber.trim().replace(/\s/g, '');
    if (!/^\d{10}$/.test(phoneDigits)) {
      setClientError('Phone number must be exactly 10 digits.');
      return;
    }

    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setClientError('Please enter a valid age between 1 and 120.');
      return;
    }

    try {
      await register(fullName, email, password, confirmPassword, phoneDigits, ageNum);
      navigate('/user/dashboard');
    } catch (err) {
      // Error handled by AuthContext
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'radial-gradient(circle at 50% 30%, #1e1b4b 0%, #0b0f19 70%)',
      }}
    >
      <div
        className="glass-panel animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '2.5rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Create Account
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Join the platform to access user dashboard features
          </p>
        </div>

        <ErrorAlert message={clientError || error} onClose={() => { setClientError(''); clearError(); }} />

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Full Name"
            type="text"
            placeholder="e.g. Jane Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            icon={User}
          />

          <FormInput
            label="Email Address"
            type="email"
            placeholder="e.g. user@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={Mail}
          />

          {/* Phone Number and Age side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormInput
              label="Phone Number"
              type="tel"
              placeholder="10-digit number"
              value={phoneNumber}
              onChange={(e) => {
                // Only allow digits, max 10
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhoneNumber(val);
              }}
              required
              icon={Phone}
            />
            <FormInput
              label="Age"
              type="number"
              placeholder="e.g. 25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              icon={Calendar}
            />
          </div>

          <FormInput
            label="Password"
            type="password"
            placeholder="Min 8 chars, Upper, Lower & Digit"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={Lock}
          />

          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            icon={Lock}
          />

          {/* Password Validation Indicator */}
          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(17, 24, 39, 0.6)',
              border: '1px solid var(--border-color)',
              marginBottom: '1.25rem',
              fontSize: '0.78rem',
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Password Requirements:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
              <div style={{ color: isMinLength ? 'var(--accent-emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={13} /> Min 8 characters
              </div>
              <div style={{ color: hasUpper ? 'var(--accent-emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={13} /> Upper case (A-Z)
              </div>
              <div style={{ color: hasLower ? 'var(--accent-emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={13} /> Lower case (a-z)
              </div>
              <div style={{ color: hasNumber ? 'var(--accent-emerald)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={13} /> Number (0-9)
              </div>
              <div style={{ color: isMatching ? 'var(--accent-emerald)' : 'var(--text-muted)', gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={13} /> Passwords match
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            icon={UserPlus}
            style={{ width: '100%', padding: '0.85rem' }}
          >
            Register Account
          </Button>
        </form>

        {/* Login Link */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
