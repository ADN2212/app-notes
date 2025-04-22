import SingleNote from "../SingleNote/SingleNote";
import { useContext } from "react";
import { GlobalContext } from "../GlobalContext/GlobalContext";
import { INote } from "../types/note";

function Sidebar() {

    const globalContext = useContext(GlobalContext)
    const { notesArray = [] } = globalContext || {}

    return (
        <div className="app-sidebar">
            <div className="app-sidebar-header">
                <h3> Tu lista de notas: </h3>
            </div>
            <div className="app-sidebar-notes">
                {notesArray.length > 0 ? notesArray.filter((note: INote) => !note.deletedOffLine).map(
                    (note: INote, i: number) => {
                        return (
                            <div key={i}>
                                <SingleNote note={note} />
                            </div>
                        )
                    }
                ) : <div className="app-sidebar-header">
                    No hay notas
                </div>}
            </div>
        </div>
    )
}

export default Sidebar;
