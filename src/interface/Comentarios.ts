export interface ComentarioAntigo {
    id: number;
    name: string;
    email: string;
    body: string;
}

export interface Comentario {
    id: number;
    titulo: string;
    texto: string;
    data: string;
    tipo: "aviso" | "lembrete" | "comunicado";
}

// Exemplos de uso correto das interfaces
/*
const cp1: Comentario = {
    id: 1,
    titulo: "Aviso importante",
    texto: "Este é um aviso importante",
    data: "2023-05-15",
    tipo: "aviso"
}

type ComentarioSemId = Omit<Comentario, "id">
const cp2: ComentarioSemId = {
    titulo: "Lembrete de reunião",
    texto: "Não esqueça da reunião amanhã",
    data: "2023-05-16",
    tipo: "lembrete"
}
*/


