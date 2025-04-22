import ReactMarkdown from "react-markdown";
import { useContext } from "react";
import { GlobalContext } from "../GlobalContext/GlobalContext";


function NotePreiew() {

  const globalContext = useContext(GlobalContext)
  
  if(globalContext === null){
    return
  }

  const {activeNote} = globalContext

  return (
    <div className="app-main-note-preview">
      <h1 className="preview-title">{activeNote.title}</h1>
      <div className="markdown-preview">
        <ReactMarkdown>
          {activeNote.body}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default NotePreiew
