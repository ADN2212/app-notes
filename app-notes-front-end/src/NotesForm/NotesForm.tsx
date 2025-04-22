import fetchAPI from "../utils/fetchAPI";
import { defaultNote } from "../constants";
import { Dispatch, SetStateAction, useContext } from "react";
import { GlobalContext } from "../GlobalContext/GlobalContext";
import uuid from "react-uuid";
import { INote } from "../types/note";
import { IUser } from "../types/user";

function NotesForm() {

    const globalContext = useContext(GlobalContext)

    if(globalContext === null){
        return
    }

    const { user, notesArray, setNotesArray, activeNote, setActiveNote} = globalContext

    return (
        <div className="app-main-note-edit">
            <input
                type="text"
                id="title"
                placeholder="Titulo"
                value={activeNote.title}
                autoFocus
                onChange={(e) => { onChangeNote(activeNote, 'title', e.target.value, setActiveNote) }}
            />
            <textarea
                id="body"
                placeholder="Escrive tu nota aqui ..."
                value={activeNote.body}
                onChange={(e) => { onChangeNote(activeNote, 'body', e.target.value, setActiveNote) }}
            />
            <button 
                onClick={() => {
                if (activeNote.id === undefined) {
                    addNote(user as unknown as IUser, activeNote, notesArray, setNotesArray)
                    setActiveNote(defaultNote)
                } else {
                    editNote(user as unknown as IUser, activeNote, notesArray, setActiveNote as unknown as Dispatch<SetStateAction<INote[]>>)
                    setActiveNote(defaultNote)
                }
            }}>
                {activeNote.id ? 'Editar' : 'Guardar'}
            </button>
            <button
                id='clear-btn'
                onClick={() => setActiveNote(defaultNote)}
                className="app-sidebar-note-button">
                Limpiar
            </button>
        </div>
    )
}

export default NotesForm

function onChangeNote(currVal: INote, field: string, value: string, setFunc: React.Dispatch<React.SetStateAction<INote>>) {
    setFunc({
        ...currVal,
        [field]: value
    })
}

interface INoteResponse {
    newNote: INote;
    sessionExpired: boolean;
}

async function addNote(user: IUser, crrentNote: INote, notesArray: INote[], setNotesArray: React.Dispatch<React.SetStateAction<INote[]>>) {

    if (crrentNote.title.length === 0 || crrentNote.body.length === 0) {
        alert('Tanto el titulo como el cuerpo son necesarios para crear una nota.')
        return
    }


    if (navigator.onLine) {
        const result = await fetchAPI<INoteResponse>('insertNote', 'POST', crrentNote, user.accessToken)
        if (result.sessionExpired) {
            alert('Su sesion ha expirado, por favor vuelva a hacer log-in.')
            sessionStorage.clear()
            window.location.href = `${window.location.origin}/login`
            return
        }
        setNotesArray([...notesArray, result.newNote])
    } else {
        const newNote = crrentNote
        newNote.id = uuid()
        newNote.createdOffline = true
        setNotesArray([...notesArray, newNote])
    }
}

type IUpdatedNote = Partial<INote> & {
    updatedOffLine?: boolean;
}

interface IEditNoteResponse{
    updatedNote?: IUpdatedNote
    sessionExpired?: boolean;
}

async function editNote(user: IUser, note: INote, notesArray: INote[], setNotesArray: React.Dispatch<React.SetStateAction<INote[]>>) {

    if (note.title.length === 0 || note.body.length === 0) {
        alert('Su nota debe tener tanto titilo como cuerpo.')
        return
    }

    let updatedNote = null 

    if (navigator.onLine) {
        const result = await fetchAPI<IEditNoteResponse>('editNote', 'PUT', note, user.accessToken)
        if (result.sessionExpired) {
            alert('Su sesion ha expirado, por favor vuelva a hacer log-in.')
            sessionStorage.clear()
            window.location.href = `${window.location.origin}/login`
            return
        }
        updatedNote = result.updatedNote
    }

    if (updatedNote === null) {
        updatedNote = note as IUpdatedNote
        (updatedNote).updatedOffLine = true
    }

    for (const currentNote of notesArray) {
        if (updatedNote && currentNote.id === updatedNote.id) {
            currentNote.title = updatedNote.title || currentNote.title
            currentNote.body = updatedNote.body || currentNote.body
        }
    }
    
    setNotesArray(notesArray)
}
