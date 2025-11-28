// types.ts

export interface Student {
	Nome: string;
	Funcao: string;
}

export interface CourseInfo {
	nomeCurso: string; // Ex: Capacitação em Aleitamento
	periodo: string; // Ex: 20 a 25 de Novembro
	cargaHoraria: string; // Ex: 20h
}

export interface SignatureConfig {
	id: string;
	name: string;
	role: string;
	imagePreview: string;
}
