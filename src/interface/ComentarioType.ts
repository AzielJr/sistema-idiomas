// Definição e exportação da interface Comentario
export interface Comentario {
    id: number;
    titulo: string;
    texto: string;
    data: string;
    tipo: "aviso" | "lembrete" | "comunicado";
}