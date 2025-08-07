// Definição da interface Comentario
interface Comentario {
    id: number;
    titulo: string;
    texto: string;
    data: string;
    tipo: "aviso" | "lembrete" | "comunicado";
}

// Exportação default da interface
export default Comentario;