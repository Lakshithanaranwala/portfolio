'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled, { ThemeProvider } from 'styled-components';

/* ─── Minimal dark theme for login (no ThemeProvider wrapper needed here) ─ */

const Page = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background: #111;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 2.5rem;
`;

const Logo = styled.p`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 300;
  color: #fff;
  margin-bottom: 0.25rem;
  letter-spacing: -0.02em;
`;

const Sub = styled.p`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: #666;
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 6px;
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  margin-bottom: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #FF6B35;
  }
`;

const Button = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 0.875rem;
  background: #FF6B35;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: ${({ $loading }) => ($loading ? 'not-allowed' : 'pointer')};
  opacity: ${({ $loading }) => ($loading ? 0.7 : 1)};
  transition: opacity 0.2s ease, background 0.2s ease;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background: #e05a26;
  }
`;

const ErrorMsg = styled.p`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: #e74c3c;
  margin-top: 0.75rem;
  text-align: center;
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Invalid username or password.');
      setLoading(false);
    }
  }

  return (
    <Page>
      <Card>
        <Logo>Portfolio CMS</Logo>
        <Sub>Sign in to manage your case studies</Sub>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Button type="submit" $loading={loading} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
          {error && <ErrorMsg>{error}</ErrorMsg>}
        </form>
      </Card>
    </Page>
  );
}
