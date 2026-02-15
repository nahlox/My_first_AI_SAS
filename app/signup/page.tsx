'use client'

import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (signUpError) {
        setError(signUpError.message)
        console.error('Signup error:', signUpError.message)
      } else if (data.session) {
        console.log('Signup successful, redirecting to dashboard...')

        await supabase.from('credits').insert({
          user_id: data.user?.id,
          balance: 10
        })

        router.push('/dashboard')
      } else if (data.user) {
        console.log('User created, but email confirmation may be required')
        router.push('/dashboard')
      } else {
        setError('Please check your email to verify your account')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Get Started</h1>
          <p className="text-gray-400 mb-6">Create your account</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 block mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#0a0a0a] border-gray-700 text-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-[#0a0a0a] border-gray-700 text-white"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <p className="text-gray-400 text-center mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:text-blue-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
