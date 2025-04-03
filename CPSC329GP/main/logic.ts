import Store from "electron-store"
import crypto from 'crypto'

// Interface defining what each password entry has to look like
interface PasswordEntry{
    id: string
    service: string
    username: string
    password: string
}

// Interface defining structure for all user related data. 
interface UserData{
    masterPassword: string
    entries: PasswordEntry[]
}

class logic {
    private store: Store
    // readonly = final 
    private readonly saltRounds = 10 //number of iterations for the hashing algorithm to run

    constructor(){
        this.store = new Store({
            name: 'passwordStorage', defaults: {}
        })
    }

    private hashPassword(password: string): string {
        return ''
    }

    private verifyPassword(password:string, hashedPassword: string): boolean {
        return true
    }

    async createUser(username: string, masterPassword: string): Promise<boolean>{
        return true
    }

    async verifyUser(username: string, masterPassword: string): Promise<boolean>{
        return true
    }

    async getEntries(username: string): Promise<PasswordEntry[]>{
        return []
    }

    async addEntry(username: string, entry: PasswordEntry): Promise<boolean>{
        return true
    }

    async updateEntry(username: string, entryId: string, updatedEntry: PasswordEntry): Promise<boolean>{
        return true
    }

    async deleteEntry(username: string, entryId: string): Promise<boolean>{
        return true
    }

}
export const backendLogic = new logic()