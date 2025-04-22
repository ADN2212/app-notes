import { useContext } from "react";
import { GlobalContext } from "../GlobalContext/GlobalContext";
import { IUser } from "../types/user";


function Navbar() {

    const globalContext = useContext(GlobalContext)

    if(globalContext === null){
        return
    }

    const { user, setUser} = globalContext

    if (!user) {
        return <></>
    }

    const userInfo = user as unknown as IUser

    return (
        <div className="navbar">
            <span className="navbar-user">{userInfo.username}</span>
            <button className="navbar-logout" onClick={() => { 
                sessionStorage.clear()
                setUser(false)
                }
            }>
                Cerrar sesión
            </button>
        </div>
    );
}

export default Navbar;


