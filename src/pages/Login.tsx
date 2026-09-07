import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            })

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            navigate("/dashboard", { replace: true });
        } catch {
            setErrorMessage("Nao foi possivel entrar. Tente novamente");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="profile-page">
            <h1>Entrar no AstremBio</h1>

            <form className="link-form" onSubmit={handleLogin}>
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
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                />

                {errorMessage && <p role="role">{errorMessage}</p>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </main>
    )
}