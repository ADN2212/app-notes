import React, { useState } from 'react'
import { GlobalContext } from './GlobalContext'
import { defaultNote } from '../constants'
import { IUser } from '../types/user'
import { INote } from '../types/note'

interface GlobalContextProviderProps {
    chilldren: React.ReactNode
}

export function GlobalContextProvider({chilldren}: GlobalContextProviderProps) {
    
    const getUserData = sessionStorage.getItem('user')
    const userData: IUser = getUserData !== null ?  JSON.parse(getUserData) : false

    const [user, setUser] = useState<IUser | boolean>(userData)
    const [notesArray, setNotesArray] = useState<INote[]>([])
    const [activeNote, setActiveNote] = useState<INote>(defaultNote)

    return (
        <GlobalContext.Provider value={{
            user,
            setUser,
            notesArray,
            setNotesArray,
            activeNote,
            setActiveNote,
        }}>
            {chilldren}
        </GlobalContext.Provider>
    )
}
