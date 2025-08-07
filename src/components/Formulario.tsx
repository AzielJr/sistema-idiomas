import { useRef, useState } from "react";
import { Comentario } from "../interface/ComentarioData"
import axios from "axios";
import { Box, Button, TextField } from "@mui/material";

interface FormularioProps {
    onComentario: (comentario: Comentario) => void;
}

export const Formulario = ({onComentario}:FormularioProps) => {
    const nameRef = useRef<HTMLInputElement>(null);
    const[body, setBody] = useState("");
    const[enviado, setEnviado] = useState(false);

    const submeterEnvio=async () => {
        const name = nameRef.current?.value || "";
        if(!name || !body) return alert("Preencha todos os campos vazios")
        setEnviado(true);
        const resposta = await axios.post("https://jsonplaceholder.typicode.com/comments", {
            name, body, email:"email@teste.com", postId:1
        })

        console.log("Dado enviado pelo POST", resposta.data);
        onComentario(resposta.data);
        alert("Comentário enviado.");
        nameRef.current!.value="";
        setBody("");
        setEnviado(false);
        
    }
    return(
        <Box>
            <TextField inputRef={nameRef} label="name" fullWidth variant="outlined" margin="normal" >
            </TextField>

            <TextField value={body} onChange={e=>setBody(e.target.value)} rows={4} multiline label="comentario" fullWidth variant="outlined" margin="normal" >
            </TextField>

            <Box sx={{display:"flex", justifyContent:"flex-end", mt:2}}>
            <Button variant="contained" sx={{backgroundColor:"#1e88e5"}} onClick={submeterEnvio} disabled={enviado}>
                {enviado ? "Enviando..":"Enviar"}
            </Button>

            </Box>
        </Box>
    )
}
