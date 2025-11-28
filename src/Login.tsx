import { Activity, Baby, Lock, User } from "lucide-react";
import { useState } from "react";

interface LoginProps {
	onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
	const [user, setUser] = useState("");
	const [pass, setPass] = useState("");
	const [error, setError] = useState("");

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();

		// --- AUTENTICAÇÃO SIMPLES ---
		// Você pode alterar essas credenciais aqui
		const VALID_USER = import.meta.env.VITE_VALID_USER;
		const VALID_PASS = import.meta.env.VITE_VALID_PASS;

		console.log({ VALID_PASS, VALID_USER });

		if (user === VALID_USER && pass === VALID_PASS) {
			onLoginSuccess();
		} else {
			setError("Usuário ou senha incorretos.");
		}
	};

	return (
		<div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
				{/* Cabeçalho Visual */}
				<div className="bg-blue-600 p-8 text-center">
					<div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
						<Baby className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-2xl font-bold text-white">
						Maternidade Leila Diniz
					</h1>
					<p className="text-blue-100 text-sm mt-1">
						Sistema de Gestão de Certificados
					</p>
				</div>

				{/* Formulário */}
				<div className="p-8">
					<form onSubmit={handleLogin} className="space-y-5">
						{error && (
							<div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center">
								{error}
							</div>
						)}

						<div className="space-y-2">
							<label className="text-sm font-semibold text-gray-600 ml-1">
								Usuário
								<div className="relative">
									<User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
									<input
										type="text"
										className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
										placeholder="Digite seu usuário"
										value={user}
										onChange={(e) => setUser(e.target.value)}
									/>
								</div>
							</label>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-semibold text-gray-600 ml-1">
								Senha
								<div className="relative">
									<Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
									<input
										id="input"
										type="password"
										className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
										placeholder="••••••••"
										value={pass}
										onChange={(e) => setPass(e.target.value)}
									/>
								</div>
							</label>
						</div>

						<button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 mt-4"
						>
							<Activity className="w-4 h-4" /> Acessar Sistema
						</button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-xs text-gray-400">
							© 2024 Secretaria Municipal de Saúde
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
