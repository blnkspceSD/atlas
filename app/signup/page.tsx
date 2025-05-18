import React from 'react'
import Link from 'next/link'

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-primary text-3xl font-bold">atlas.</Link>
          <h1 className="mt-6 text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-gray-600">Start your journey to finding your dream remote job</p>
        </div>
        
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
              <input
                id="first-name"
                name="first-name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
              <input
                id="last-name"
                name="last-name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-gray-500">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </p>
          </div>
          
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the <Link href="/terms" className="text-primary">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="text-primary">Privacy Policy</Link>
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
            >
              Create account
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Google
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Github
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/signin" className="text-primary hover:text-primary-dark font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
} 