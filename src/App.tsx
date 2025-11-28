import { useState } from "react";
import Dashboard from "./Dashboard";
import { Login } from "./Login"; // Importe o componente que criamos no Passo 1

function App() {
	// Estado para controlar se o usuário está logado
	// DICA: Use 'localStorage' se quiser que o login persista ao recarregar a página
	const [isAuthenticated, setIsAuthenticated] = useState(() => {
		return localStorage.getItem("auth_token") === "logado";
	});

	const handleLoginSuccess = () => {
		localStorage.setItem("auth_token", "logado"); // Salva sessão
		setIsAuthenticated(true);
	};

	const handleLogout = () => {
		localStorage.removeItem("auth_token"); // Limpa sessão
		setIsAuthenticated(false);
	};

	// Se estiver autenticado, mostra o Gerador (Dashboard)
	// Se NÃO estiver, mostra a tela de Login
	return (
		<>
			{isAuthenticated ? (
				<Dashboard onLogout={handleLogout} />
			) : (
				<Login onLoginSuccess={handleLoginSuccess} />
			)}
		</>
	);
}

export default App;
