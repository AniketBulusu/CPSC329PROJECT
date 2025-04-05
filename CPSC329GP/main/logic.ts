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
    keyDerivationSalt: string;
    entries: PasswordEntry[]
}

class logic {
    private store: Store
    // readonly = final 
    private readonly saltRounds = 10000 //number of iterations for the hashing algorithm to run (much higher in real world applications)

    constructor(){
        this.store = new Store({
            name: 'passwordStorage', defaults: {}
        })
    }

    /**
     * creates random salt for encryption/derivation keys
     * @returns string
     */
    private generateSalt(): string{
        return crypto.randomBytes(16).toString('hex')
    }

    /**
     * creates a unique encryption key from the master password 
     * @param masterPassword 
     * @param salt 
     * @returns 
     */
    private deriveKey(masterPassword: string, salt: string): Buffer{
        return crypto.pbkdf2Sync(masterPassword, salt, this.saltRounds, 32, 'sha512')
    }
    
    /**
     * encrypts any string text and returns the concatenation of the iv (as a string) and the encrypted string
     * @param text 
     * @param encryptionKey 
     */
    private encryptText(text: string, encryptionKey: Buffer): string {
        const iv = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv)  // use aes cbc (cipher block chaining) mode to encrypt string with random iv 
        let encrypted = cipher.update(text, 'utf8', 'hex')  //take the text, read it as utf8 format, then format into hexadecimal readable format
        encrypted += cipher.final('hex')    // any last padding bytes or remaining unprocessed data and finish encryption
        const ivString = iv.toString('hex')
        return `${ivString}:${encrypted}`
    }
    /**
     * decrypts the encrypted string using the iv included in the encrypted string as well as the encryption key from the master password
     * @param encryptedText 
     * @param encryptionKey 
     * @returns 
     */
    private decryptText(encryptedText: string, encryptionKey: Buffer): string{
        const keyParts = encryptedText.split(':')
        if(keyParts.length !== 2){throw new Error("Yo encryption fucked up g")}
        const iv = Buffer.from(keyParts[0], 'hex')
        const encryptedString = keyParts[1]
        const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv) 
        let decryptedText = decipher.update(encryptedString, 'hex', 'utf8')
        decryptedText += decipher.final('utf8')
        return decryptedText
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

        //make a new unique salt for key derivation
        const keyDerivationSalt = this.generateSalt()
        //hash the password
        const hashedPassword = this.hashPassword(masterPassword)

        //create the user data for this username
        const userData: UserData = {
            masterPassword: hashedPassword,
            keyDerivationSalt: keyDerivationSalt,
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
        const userData = this.store.get(username) as UserData | undefined
        if(!userData){
            return false
        }
        return this.verifyPassword(masterPassword, userData.masterPassword)
    }

    async getEntries(username: string, masterPassword: string): Promise<PasswordEntry[]>{
      const userData = this.store.get(username) as UserData | undefined
      if(!userData){
        return []
      }
      const encryptionKey = this.deriveKey(masterPassword, userData.keyDerivationSalt)
      const decryptedEntries = userData.entries.map(entry=> ({
        ...entry,
        password: this.decryptText(entry.password, encryptionKey)
      }))
      return decryptedEntries
    }

    async addEntry(username: string, entry: PasswordEntry, masterPassword: string): Promise<boolean>{
        const userData = this.store.get(username) as UserData | undefined
        if(!userData){
            return false
        }
        const encryptionKey = this.deriveKey(masterPassword, userData.keyDerivationSalt)
        const encryptedPassword = this.encryptText(entry.password, encryptionKey)
        const encryptedEntry: PasswordEntry = {...entry, password: encryptedPassword}
        userData.entries.push(encryptedEntry)
        this.store.set(username, userData)
        return true
    }

    async updateEntry(username: string, entryId: string, updatedEntry: PasswordEntry, masterPassword: string): Promise<boolean>{
        const userData = this.store.get(username) as UserData | undefined 
        if(!userData){
            return false
        }

        const index = userData.entries.findIndex(e=> e.id === entryId)
        if(index === -1){
            return false
        }

        const encryptionKey = this.deriveKey(masterPassword, userData.keyDerivationSalt)
        const encryptedPassword = this.encryptText(updatedEntry.password, encryptionKey)
        const encryptedEntry: PasswordEntry = {...updatedEntry, password: encryptedPassword}

        userData.entries[index] = encryptedEntry
        this.store.set(username, userData)
        return true
    }

    async deleteEntry(username: string, entryId: string): Promise<boolean>{
        const userData = this.store.get(username) as UserData | undefined 
        if(!userData){return false}

        userData.entries = userData.entries.filter(e => e.id !== entryId)
        this.store.set(username, userData)
        return true
    }

}
export const backendLogic = new logic()