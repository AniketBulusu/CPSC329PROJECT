import React, { CSSProperties } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { PasswordEntry } from '../types/electron'




export default function HomePage() {
  // variable declaration
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const router = useRouter()

  // async function that handles the form submissions 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try{
      if(isNewUser){
        const created = await window.electron.createUser(username, password)
        if(!created){
          setError('Username already exists') 
          return}
      } 
      else{
        const verified = await window.electron.verifyUser(username, password)
        if(!verified){
          setError('Invalid username or password')
          return
        }
      }
      
      localStorage.setItem('currentUser', username)
      router.push('/dashboard')
    }catch(err: any){setError('An error occured. Please try again')}
  }

  const styles: Record<string, CSSProperties> = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      border: '1px solid #f3f4f6',
      padding: '1.5rem',
      maxWidth: '24rem',
      width: '100%',
    },
    logo: {
      display: 'flex',
      justifyContent: 'center',
    },
    logoIcon: {
      width: '3rem',
      height: '3rem',
      backgroundColor: '#4f46e5',
      borderRadius: '9999px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      marginTop: '1rem',
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#111827',
      textAlign: 'center' as const,
    },
    subtitle: {
      marginTop: '0.25rem',
      fontSize: '0.875rem',
      color: '#6b7280',
      textAlign: 'center' as const,
    },
    form: {
      marginTop: '1.5rem',
    },
    formGroup: {
      marginBottom: '0.75rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#374151',
      marginBottom: '0.25rem',
    },
    input: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      border: '1px solid #e5e7eb',
      color: '#111827',
      fontSize: '0.875rem',
    },
    error: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      textAlign: 'center' as const,
      marginBottom: '1rem',
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
    },
    btnPrimary: {
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      fontWeight: 500,
      fontSize: '0.875rem',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s',
    },
    btnLink: {
      fontSize: '0.75rem',
      color: '#4f46e5',
      fontWeight: 500,
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
    },
  };



  return (
    <div style={styles.container}>
      <Head>
        <title>{isNewUser ? 'Create Account' : 'Login'} - Password Manager</title>
      </Head>
      
      <div style={styles.card}>
        <div>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 style={styles.title}>
            {isNewUser ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={styles.subtitle}>
            {isNewUser 
              ? 'Create a new account to start managing your passwords securely'
              : 'Sign in to access your password vault'}
          </p>
        </div>
        
        <form style={styles.form} onSubmit={handleSubmit}>
          <div>
            <div style={styles.formGroup}>
              <label htmlFor="username" style={styles.label}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={styles.btnPrimary}
            >
              {isNewUser ? 'Create Account' : 'Sign in'}
            </button>
            <button
              type="button"
              onClick={() => setIsNewUser(!isNewUser)}
              style={styles.btnLink}
            >
              {isNewUser ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
