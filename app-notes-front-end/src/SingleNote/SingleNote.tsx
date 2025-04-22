import fetchAPI from "../utils/fetchAPI";
import { defaultNote } from "../constants";
import ReactMarkdown from "react-markdown";
import { marked } from 'marked';
import html2pdf from 'html2pdf.js';
import { useContext, useEffect } from "react";
import { GlobalContext } from "../GlobalContext/GlobalContext";
import type { INote } from "../types/note";
import { IUser } from "../types/user";

interface SingleNoteProps {
    note: INote;
}

function SingleNote({ note }: SingleNoteProps) {

    const globalContext = useContext(GlobalContext)
    const { user, notesArray, setNotesArray, activeNote, setActiveNote } = globalContext || {}
    note = note === undefined ? defaultNote : note
    const activeNoteId = activeNote !== undefined ? activeNote.id : null

    return (
        <div className={
            note.id === activeNoteId ?
                "app-sidebar-note active" : "app-sidebar-note"
        } key={note.id} onClick={(() => {
            setActiveNote && setActiveNote(note)
        })
        }>
            <div className="sidebar-note-title">
                <strong> {note.title} </strong>
            </div>
            <div>
                <ReactMarkdown>
                    {note.body && note.body.substr(0, 100) + "..."}
                </ReactMarkdown>
            </div>
            <div>
                <button
                    onClick={() => { 
                        if (setNotesArray && setActiveNote) {
                            erraseNote(note, user as IUser, notesArray as INote[], setNotesArray, setActiveNote);
                        }
                    }}
                    className="app-sidebar-note-button">
                    Borrar
                </button>
                <button
                    onClick={() => { createPDF(note) }}
                    className="app-sidebar-note-button">
                    PDF
                </button>
                <button
                    onClick={() => { createMarkdownFile(note) }}
                    className="app-sidebar-note-button">
                    Markdown
                </button>
            </div>
        </div>
    )
}

export default SingleNote;

interface IDeleteNote {
    sessionExpired: boolean;
}

async function erraseNote(note: INote, user: IUser, notesArray: INote[], setNotesArray: React.Dispatch<React.SetStateAction<INote[]>>, setActiveNote: React.Dispatch<React.SetStateAction<INote>>) {

    if (navigator.onLine) {
        const result = await fetchAPI<IDeleteNote>("deleteNote", 'DELETE', { id: note.id, userid: user.id }, user.accessToken)
        if (result.sessionExpired) {
            alert('Lo sentimos su session a expirado, vuelva a hacer log-in.')
            sessionStorage.clear()
            window.location.href = `${window.location.origin}/login`
            return
        }
        setActiveNote(defaultNote)
        const newNotesArray = notesArray.filter(((n: INote) => n.id !== note.id))
        setNotesArray(newNotesArray)
    } else {
        const newNote = note
        newNote.deletedOffLine = true
        const newNotesArray = notesArray.filter((n: INote) => n.id !== note.id).concat([newNote])
        setTimeout(() => {
            const btn = document.getElementById('clear-btn')
            if (btn) {
                btn.click();
            }
        }, 50)
        setNotesArray(newNotesArray)
    }
}

function createMarkdownFile(note: INote) {
    const text = `
# ${note.title}, No.${note.id}

${note.body}

Descargada el ${getFormatedDate()}`

    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function getFormatedDate() {
    const now = new Date();
    const day = now.getDate()
    const month = now.getMonth() + 1
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
}

function createPDF(note: INote) {
    const text = `
# ${note.title}, No.${note.id}

${note.body}

Descargada el ${getFormatedDate()}`
    const mdParsedToHtml = marked(text)
    html2pdf()
        .from(mdParsedToHtml)
        .set({
            margin: 10,
            filename: `${note.title}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .save();
}
