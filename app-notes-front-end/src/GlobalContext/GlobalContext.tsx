import { createContext } from 'react';
import { INote } from '../types/note';
import { IUser } from '../types/user';

interface ProviderContext {
    user: IUser | boolean,
    setUser: React.Dispatch<React.SetStateAction<IUser | boolean>>,
    notesArray: INote[],
    setNotesArray: React.Dispatch<React.SetStateAction<INote[]>>,
    activeNote: INote,
    setActiveNote: React.Dispatch<React.SetStateAction<INote>>,
}

export const GlobalContext = createContext<ProviderContext | null>(null);


