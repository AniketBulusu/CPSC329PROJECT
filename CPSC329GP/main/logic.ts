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
    private readonly saltRounds = 100 //number of iterations for the hashing algorithm to run (much higher in real world applications)

    constructor(){
        this.store = new Store({
            name: 'passwordStorage', defaults: {}
        })
    }
    /**
     * hashes the password through 100 salt rounds using the sha512 algorithm
     * @param password 
     * @returns string
     */
    private hashPassword(password: string): string {
        const salt = crypto.randomBytes(16).toString('hex') //create a random 16 byte (32 bit) hexadecimal format salt string
        const hash = crypto.pbkdf2Sync(password, salt, this.saltRounds, 64, 'sha512').toString('hex') //uses sha512 algorithm to create a secure hashed version of the password
        return `${salt}:${hash}`
    }
    /**
     * verifies that the entered password matches the correct password by rehashing the input password with the stored salt. 
     * @param password 
     * @param hashedPassword 
     * @returns 
     */
    private verifyPassword(password:string, hashedPassword: string): boolean {
        const [salt, hash] = hashedPassword.split(':')

        const verifyHash = crypto.pbkdf2Sync(password, salt, this.saltRounds, 64, 'sha512').toString('hex')

        const isValid = hash === verifyHash 

        return isValid
    }
    /**
     * creates a new user and stores it in the electron store 
     * @param username 
     * @param masterPassword 
     * @returns 
     */
    async createUser(username: string, masterPassword: string): Promise<boolean>{

    try{
        if(this.store.has(username)){
            return false
        }
        //hash the password
        const hashedPassword = this.hashPassword(masterPassword)

        //create the user data for this username
        const userData: UserData = {
            masterPassword: hashedPassword,
            entries: []
        }

        //store the username and the data in db. 
        this.store.set(username, userData)
        return true
    }catch(error){
        throw error
    }
    }
    /**
     * uses verifyPassword function to check that the master password matches the username during login 
     * @param username 
     * @param masterPassword 
     * @returns 
     */
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