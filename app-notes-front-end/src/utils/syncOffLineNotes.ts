import { INote } from "../types/note";
import { IUser } from "../types/user";
import fetchAPI from "./fetchAPI";

interface ISessionExpired {
    sessionExpired?: boolean;
  }

export default async function syncOffLineNotes(
    user: IUser,
    notesArray: INote[],
    setNotesArray: React.Dispatch<React.SetStateAction<INote[]>>,
) {

    let updates = false
    
    for (const note of notesArray) {
        if (note.createdOffline && !note.deletedOffLine) {
            updates = true
            const result = await fetchAPI<ISessionExpired>('insertNote', 'POST', note, user.accessToken)
            if (result.sessionExpired) {
                alert('Su sesion ha expirado, por favor vuelva a hacer log-in.')
                sessionStorage.clear()
                window.location.href = `${window.location.origin}/login`
                return null
            }
        }

        if (!note.createdOffline && note.deletedOffLine) {
            updates = true
            const result = await fetchAPI<ISessionExpired>("deleteNote", 'DELETE', { id: note.id, userid: user.id }, user.accessToken)
            if (result.sessionExpired) {
                alert('Lo sentimos su session a expirado, vuelva a hacer log-in.')
                sessionStorage.clear()
                window.location.href = `${window.location.origin}/login`
                return null
            }
        }

        if (!note.createdOffline && !note.deletedOffLine && note.updatedOffLine) {
            updates = true
            const result = await fetchAPI<ISessionExpired>('editNote', 'PUT', note, user.accessToken)
            if (result.sessionExpired) {
                alert('Su sesion ha expirado, por favor vuelva a hacer log-in.')
                sessionStorage.clear()
                window.location.href = `${window.location.origin}/login`
                return null
            }
        }
    }

    if (updates) {
        let result = await fetchAPI<ISessionExpired>('getAllNotes', 'POST', {}, user.accessToken)
        if (result !== null) {
            if (result.sessionExpired) {
                alert('Su session ha expirado, por favor vuelca a acceder.')
                sessionStorage.clear()
                window.location.href = `${window.location.origin}/login`
                return null 
            }
            setNotesArray(result as unknown as INote[])
        }
    }
    return true
}




// let newNotesArray = []
// const offLineAddedNotes = notesArray.filter((note) => note.offLineNote)
// if (offLineAddedNotes.length > 0) {
//     console.log('Agregando notas faltantes')
//     for (const note of offLineAddedNotes) {
//         //console.log(note)
//         const result = await fetchAPI('insertNote', 'POST', note, user.accessToken)
//         if (result.sessionExpired) {
//             alert('Su sesion ha expirado, por favor vuelva a hacer log-in.')
//             sessionStorage.clear()
//             window.location.href = `${window.location.origin}/login`
//             return
//         }
//         newNotesArray.push(result.newNote)
//     }
//     newNotesArray = notesArray.filter(note => !note.offLineNote).concat(newNotesArray)
// }
// if (newNotesArray.length === 0) {
//     newNotesArray = notesArray
// }
