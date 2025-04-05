import { useEffect, useState } from "react";
import { PasswordEntry } from "../types/electron";
import { useRouter } from "next/router";

export default function DashboardPage(){
    const [entries, setEntries] = useState<PasswordEntry[]>([])
    const [newEntry, setNewEntry] = useState<PasswordEntry>({
        id: '',
        service: '',
        username: '',
        password: '',
    })
    const [error, setError] = useState('')
    const router = useRouter()

    const currentUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser')
        if(!currentUser){
            router.push('/login')
            return
        }

        async function fetchEntries(){
            try{
                const fetchedEntries = await window.electron.getEntries(currentUser)
                setEntries(fetchedEntries)
            }catch (err){
                setError('Failed to load entries')
            }
        }
        fetchEntries()
    }, [currentUser, router])

    const handleAddEntry = async(e: React.FormEvent) => {
        e.preventDefault()
        if(!currentUser) {return}

        const id = Date.now.toString()
        const entry: PasswordEntry = { ...newEntry, id}

        try{
            const succes = await window.electron.addEntry(currentUser, entry)
            
        }catch(error){

        }
    }
}