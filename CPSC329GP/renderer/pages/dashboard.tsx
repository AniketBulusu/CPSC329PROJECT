import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { PasswordEntry } from '../types/electron'

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '40px',
    color: '#333',
  },
  header: {
    marginBottom: '20px',
    color: 'white',
    textAlign: 'center' as const,
  },
  logoutButton: {
    padding: '8px 12px',
    backgroundColor: '#e53e3e',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  list: {
    listStyleType: 'none' as const,
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryDetails: {
    flex: 1,
    paddingRight: '10px',
  },
  editPanel: {
    width: '280px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
  },
  editContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px',
    width: '100%',
  },
  inlineEditRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '5px',
  },
  editLabel: {
    fontWeight: 'bold' as const,
    width: '80px',
  },
  editButtons: {
    marginTop: '5px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  formGroup: {
    marginBottom: '15px',
    display: 'block',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold' as const,
    display: 'block',
  },
  input: {
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '5px',
    display: 'block',
    width: '100%',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '8px',
  },
  deleteButton: {
    backgroundColor: '#e53e3e',
    padding: '6px 10px',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginLeft: '8px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  addEntryForm: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  addEntryRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '10px',
    alignItems: 'flex-end',
  },
  compactFormGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
    minWidth: '140px',
  },
}

export default function Dashboard() {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)
  const [masterPassword, setMasterPassword] = useState<string>('')

  const [entries, setEntries] = useState<PasswordEntry[]>([])
  const [newEntry, setNewEntry] = useState<PasswordEntry>({
    id: '',
    service: '',
    username: '',
    password: '',
  })
  const [error, setError] = useState<string>('')

  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    const storedMaster = sessionStorage.getItem('masterPassword')
    if (!storedUser || !storedMaster) {
      router.push('/home')
    } else {
      setUsername(storedUser)
      setMasterPassword(storedMaster)
    }
  }, [router])

  useEffect(() => {
    if (username && masterPassword) {
      loadEntries()
    }
  }, [username, masterPassword])

  const loadEntries = async () => {
    try {
      const fetchedEntries = await window.electron.getEntries(username as string, masterPassword)
      setEntries(fetchedEntries)
      setError('')
    } catch (err) {
      setError('Failed to load entries.')
    }
  }

  const handleNewEntryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value })
  }

  const handleAddEntry = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username || !masterPassword) {
      setError('Missing credentials.')
      return
    }
    const id = Date.now().toString()
    const entry: PasswordEntry = { ...newEntry, id }
    try {
      const success = await window.electron.addEntry(username, entry, masterPassword)
      if (success) {
        await loadEntries()
        setNewEntry({ id: '', service: '', username: '', password: '' })
        setError('')
      } else {
        setError('Failed to add entry.')
      }
    } catch (err) {
      console.error(err)
      setError('Error adding entry.')
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const success = await window.electron.deleteEntry(username as string, entryId)
      if (success) {
        await loadEntries()
      } else {
        setError('Failed to delete entry.')
      }
    } catch (err) {
      console.error(err)
      setError('Error deleting entry.')
    }
  }

  const startEditing = (entry: PasswordEntry) => {
    setEditingEntryId(entry.id)
    setEditingEntry({ ...entry })
  }

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (editingEntry) {
      setEditingEntry({ ...editingEntry, [e.target.name]: e.target.value })
    }
  }

  const cancelEditing = () => {
    setEditingEntryId(null)
    setEditingEntry(null)
  }

  const saveEditing = async () => {
    if (!username || !masterPassword || !editingEntry || !editingEntryId) {
      setError('Missing credentials or editing entry.')
      return
    }
    try {
      const success = await window.electron.updateEntry(username, editingEntryId, editingEntry, masterPassword)
      if (success) {
        await loadEntries()
        cancelEditing()
      } else {
        setError('Failed to update entry.')
      }
    } catch (err) {
      console.error(err)
      setError('Error updating entry.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    sessionStorage.removeItem('masterPassword')
    router.push('/home')
  }

  return (
    <div style={styles.container}>
      <Head>
        <title>Dashboard - Password Manager</title>
      </Head>
      <header style={styles.header}>
        <h1>Welcome, {username}</h1>
        <p>Your secure password vault</p>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main style={styles.card}>
        {error && <p style={styles.error}>{error}</p>}
        <h2 style={styles.title}>Your Password Entries</h2>
        {entries.length === 0 ? (
          <p>No entries found. Start by adding one below.</p>
        ) : (
          <ul style={styles.list}>
            {entries.map((entry) => (
              <li key={entry.id} style={styles.listItem}>
                <div style={styles.entryDetails}>
                  <strong>{entry.service}</strong>
                  <br />
                  {entry.username} / {entry.password}
                </div>
                <div style={styles.editPanel}>
                  {editingEntryId === entry.id && editingEntry ? (
                    <div style={styles.editContainer}>
                      <div style={styles.inlineEditRow}>
                        <span style={styles.editLabel}>Service:</span>
                        <input
                          style={styles.input}
                          type="text"
                          name="service"
                          value={editingEntry.service}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div style={styles.inlineEditRow}>
                        <span style={styles.editLabel}>Username:</span>
                        <input
                          style={styles.input}
                          type="text"
                          name="username"
                          value={editingEntry.username}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div style={styles.inlineEditRow}>
                        <span style={styles.editLabel}>Password:</span>
                        <input
                          style={styles.input}
                          type="text"
                          name="password"
                          value={editingEntry.password}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div style={styles.editButtons}>
                        <button style={styles.button} onClick={saveEditing}>
                          Save
                        </button>
                        <button style={styles.deleteButton} onClick={cancelEditing}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button style={styles.button} onClick={() => startEditing(entry)}>
                        Edit
                      </button>
                      <button style={styles.deleteButton} onClick={() => handleDeleteEntry(entry.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <section style={styles.card}>
        <h2 style={styles.title}>Add New Entry</h2>
        <form style={styles.addEntryForm} onSubmit={handleAddEntry}>
          <div style={styles.addEntryRow}>
            <div style={styles.compactFormGroup}>
              <label style={styles.label} htmlFor="service">Service</label>
              <input
                style={styles.input}
                type="text"
                id="service"
                name="service"
                value={newEntry.service}
                onChange={handleNewEntryChange}
                placeholder="e.g., Gmail"
                required
              />
            </div>
            <div style={styles.compactFormGroup}>
              <label style={styles.label} htmlFor="username">Username</label>
              <input
                style={styles.input}
                type="text"
                id="username"
                name="username"
                value={newEntry.username}
                onChange={handleNewEntryChange}
                placeholder="e.g., user@example.com"
                required
              />
            </div>
            <div style={styles.compactFormGroup}>
              <label style={styles.label} htmlFor="password">Password</label>
              <input
                style={styles.input}
                type="text"
                id="password"
                name="password"
                value={newEntry.password}
                onChange={handleNewEntryChange}
                placeholder="Password"
                required
              />
            </div>
            <div style={styles.compactFormGroup}>
              <button style={styles.button} type="submit">
                Add Entry
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}
