import { ChangeEvent, MouseEvent, useState } from "react";
import fetchAPI from "../utils/fetchAPI";
import { Link } from "react-router-dom";

interface ErrorResponse {
    error: object;
}

function Register() {

    const [form, setForm] = useState({ username: "", password: "", password2: "" });
    const [seePassword, setSeePassword] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (form.username.length === 0 || form.password.length === 0 || form.password2.length === 0) {
            alert('Por favor llene todos los campos.')
            return
        }
        if (form.password !== form.password2) {
            alert('Las contraseñas no coinciden.')
            return
        }

        if (form.username.length < 5) {
            alert('Su nombre de usuario debe tener una logitud mayor de 5 caracteres.')
            return
        }

        if (form.password.length < 8) {
            alert('La contraseña debe tener mas de 8 caracteres.')
        }

        const result = await fetchAPI<ErrorResponse>('registerUser', 'POST', form)
        
        if (result.error !== undefined) {
            alert('Ya existe un usuario con este nombre.')
        };
        
        alert(`Usuario creado exitosamente, usernmae: ${form.username}, password: ${form.password}`)
        const loginBtn = document.getElementById('login-btn')
        if (loginBtn) {
            loginBtn.click();
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form">
                <h2>Registrarse</h2>
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
                <input
                    type={!seePassword ? "password" : 'text'}
                    name="password2"
                    placeholder="Repita su contraseña"
                    value={form.password2}
                    onChange={handleChange}
                />
                <div>
                    <center>
                        <button
                            className="app-sidebar-note-button"
                            onClick={handleSubmit}>
                            Crear cuenta
                        </button>

                        <button
                            className="app-sidebar-note-button"
                            onClick={(e) => {
                                e.preventDefault()
                                setSeePassword(!seePassword)
                            }}
                        >
                            {
                                !seePassword ? 'ver' : 'Ocultar'
                            }
                        </button>
                        <Link to='/login'>
                            <button id='login-btn' className="app-sidebar-note-button">
                                Ir al Login
                            </button>
                        </Link>
                    </center>
                </div>
            </form>
        </div>
    );
}

export default Register;
