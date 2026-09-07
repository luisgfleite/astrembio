import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    async function handleRegister(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(true);
        
        
        try {

            if (password !== confirmPassword) {
                setErrorMessage("As senhas não coincidem.");
                return;
            }

            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
            })
            
            if (error) {
                setErrorMessage(error.message);
                return;
            }

            if (!data.session) {
                setSuccessMessage("Verifique seu e-mail para confirmar o cadastro. Depois, faça login.");
                setPassword("");
                setConfirmPassword("");
                return;
            }
            navigate("/dashboard", { replace: true });
        } catch {
            setErrorMessage("Não foi possível criar a conta. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="profile-page">
            <h1>Crie sua conta</h1>

            <form className="link-form" onSubmit={handleRegister}>
                <label htmlFor="email">E-mail</label>
                <input 
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                />

                <label htmlFor="password">Senha</label>
                <input 
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                />

                <label htmlFor="confirm-password">Confirmar senha</label>
                <input 
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                />

                {errorMessage && <p role="alert">{errorMessage}</p>}
                {successMessage && <p role="status">{successMessage}</p>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Criar conta"}
                </button>
            </form>
            <p>Já tem uma conta? <Link to="/login">Entrar</Link></p>
        </main>
    )
}
