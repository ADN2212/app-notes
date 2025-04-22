import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import fetchAPI from "../utils/fetchAPI";
import { Link} from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../GlobalContext/GlobalContext";
import { IUser } from "../types/user";

interface LoginResult {
    id: number;
    accessToken: string;
    error: unknown;
    sessionExpired?: boolean;
}

function Login() {
    
    const [form, setForm] = useState({ username: "", password: ""});
    const [seePassword, setSeePassword] = useState(false)
    const globalContext = useContext(GlobalContext)

    const setUser = globalContext?.setUser;

    useEffect(() => {
        if (setUser) {
            setUser(false);
        }
    }, [])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    async function login(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        if (form.username.length === 0 || form.password.length === 0) {
            alert('Por favor llene todos los campos')
            return
        }

        let result

        result = await fetchAPI<LoginResult>('login', 'POST', form)
        
        if (result.error) {
            alert(result.error)
            return
        }

        const user: IUser = form
        user.id = result.id
        user.accessToken = result.accessToken
        if (setUser) {
            setUser(user);
        }
        sessionStorage.setItem('user', JSON.stringify(user))
        alert(' Entrando ... ')
        window.location.href = `${window.location.origin}/`
    }

    return (<div className="auth-container">
        <form className="auth-form">
            <h2> Acceder </h2>
            <input
                type="text"
                name="username"
                placeholder="Nombre de usuario"
                value={form.username}
                onChange={handleChange}
            />
            <input
                type={!seePassword ? "password" : 'text'}
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
            />
            <div>
                <center>
                    <button
                        className="app-sidebar-note-button"
                        onClick={(e) => { 
                            login(e)
                            }}>
                        Entrar
                    </button>
                    <button
                        className="app-sidebar-note-button"
                        onClick={(e) => {
                            e.preventDefault()
                            setSeePassword(!seePassword)
                        }}
                    >
                        {
                            !seePassword ? 'Ver' : 'Ocultar'
                        }
                    </button>
                    <Link to='/register'>
                        <button id='login-btn' className="app-sidebar-note-button">
                            Crear Cuenta
                        </button>
                    </Link>
                </center>
            </div>
        </form>
    </div>)
}

export default Login;
