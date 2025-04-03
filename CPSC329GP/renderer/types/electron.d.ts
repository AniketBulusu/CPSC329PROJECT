export interface PasswordEntry {
    id: string
    service: string
    username: string
    password: string
  }
  
  export interface ElectronAPI {
    createUser: (username: string, masterPassword: string) => Promise<boolean>
    verifyUser: (username: string, masterPassword: string) => Promise<boolean>
    getEntries: (username: string) => Promise<PasswordEntry[]>
    addEntry: (username: string, entry: PasswordEntry) => Promise<boolean>
    updateEntry: (username: string, entryId: string, updatedEntry: PasswordEntry) => Promise<boolean>
    deleteEntry: (username: string, entryId: string) => Promise<boolean>
  }
  
  declare global {
    interface Window {
      electron: ElectronAPI
    }
  } 

  export{}