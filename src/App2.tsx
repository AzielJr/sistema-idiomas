import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, Container, Divider, Paper, Typography } from '@mui/material'
import ListaComentarios from './components/ListaComentarios'
import { Comentario } from './interface/ComentarioData'
import axios from 'axios'
import { Formulario } from './components/Formulario'

function App() {
  const [comentarios, setComentarios] = useState<Comentario[]>([])

  useEffect(()=>{
    axios.get<Comentario[]>('https://jsonplaceholder.typicode.com/comments?_limit=5')
      .then(reposta=>setComentarios(reposta.data))
  },[])

  const realizarComentario=(comentario:Comentario) => {
    setComentarios(prev=>[comentario, ...prev])
  }

  return (
    <Box sx={{backgroundColor:"f4f6f8", minHeight:"100vh", py:4}}>
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{padding:4, borderRadius:3}}>
            <Typography variant='h4' gutterBottom sx={{color:"1e88e5"}}>
              Comentários
            </Typography>
            <Formulario onComentario={realizarComentario}></Formulario>
            <Divider sx={{my:4}}></Divider>
            <ListaComentarios comentarios={comentarios} />
          </Paper>
        </Container>
    </Box>
      )
}

export default App
