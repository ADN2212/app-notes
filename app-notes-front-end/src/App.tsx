import './App.css';
import NotesForm from './NotesForm/NotesForm';
import NotePreiew from './NotePreview/NotePreview';
import Navbar from './Navbar/Navbar';
import { useEffect, useContext } from 'react';
import Sidebar from './Sidebar/Sidabar';
import fetchAPI from './utils/fetchAPI';
import Register from './Register/Register';
import Login from './Login/Login';
import { Route, Routes } from 'react-router-dom';
import { GlobalContext } from './GlobalContext/GlobalContext';
import syncOffLineNotes from './utils/syncOffLineNotes';
import { INote } from './types/note';
import { IUser } from './types/user';

function App() {

  const globalContext = useContext(GlobalContext)
  const { user, notesArray, setNotesArray } = globalContext || {}

  useEffect(() => {
    sessionStorage.setItem('prevOnlineState', 'online')
  }, [])

  const prevOnlineState = sessionStorage.getItem('prevOnlineState')

  if (prevOnlineState === 'offline' && navigator.onLine && user) {
      syncOffLineNotes(user as IUser, notesArray as INote[], setNotesArray as React.Dispatch<React.SetStateAction<INote[]>>)
      sessionStorage.setItem('prevOnlineState', 'offline')

  } else {
    sessionStorage.setItem('prevOnlineState', navigator.onLine ? 'online' : 'offline')
  }

  useEffect(() => {
    const fetchNotes = async (accessToken: string) => {
      let result = await fetchAPI<INote[]>('getAllNotes', 'POST', {}, accessToken)
      if (result !== null) {
        if ('sessionExpired' in result && result.sessionExpired) {
          alert('Su session ha expirado, por favor vuelca a acceder.')
          sessionStorage.clear()
          window.location.href = `${window.location.origin}/login`
          return
        }
        if (setNotesArray) {
          setNotesArray(result);
        }
      }
    }
    if (user) {
      if (typeof user !== 'boolean') {
        if (user.accessToken) {
          fetchNotes(user.accessToken);
        } else {
          console.error('Access token is undefined.');
        }
      }
    } else {
      if (window.location.href !== `${window.location.origin}/login` && window.location.href !== `${window.location.origin}/register`) {
          window.location.href = `${window.location.origin}/login`
      }
    }
  }, [user])


  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={
          <div className='app-main'>
            <NotesForm />
            <NotePreiew />
            <Sidebar />
          </div>
        } />
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
