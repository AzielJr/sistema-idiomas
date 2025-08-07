import { Navigate, Route, Routes } from "react-router-dom";
import LayoutPrincipal from "../components/LayoutPrincipal";
import Dashboard from "../pages/Dashboard";
import Cadastros from "../pages/Cadastros";
import Mov from "../pages/Mov";
import Projetos from "../pages/Projetos";
import Alunos from "../pages/Alunos"; 
import AlunosCadastro from "../pages/AlunosCadastro";
import Professores from "../pages/Professores";
import ProfessoresCadastro from "../pages/ProfessoresCadastro";
import MaterialDidatico from "../pages/MaterialDidatico";
import MaterialDidaticoCadastro from "../pages/MaterialDidaticoCadastro";
import Turmas from "../pages/Turmas";
import TurmasCadastro from "../pages/TurmasCadastro";
import Aulas from "../pages/Aulas";
import AulasCadastro from "../pages/AulasCadastro";
import MinhaAgenda from "../pages/MinhaAgenda";
import PlanoAulas from "../pages/PlanoAulas";
import PresencaFaltas from "../pages/PresencaFaltas";
import ProjetoLeitura from "../pages/ProjetoLeitura";
import ProjetoEscrita from "../pages/ProjetoEscrita";
import Unidade from "../pages/Unidade";
import GruposAcesso from "../pages/GruposAcesso";
import Usuarios from "../pages/Usuarios";
import LogSistema from "../pages/LogSistema"; 

export default function AppRotas(){
    return(
        <Routes>
            <Route path="/" element={<LayoutPrincipal/>}>
                <Route index element={<Dashboard/>}></Route>
                <Route path = "dashboard/default" element={<Dashboard/>}></Route>
                <Route path = "cadastros/default" element={<Cadastros/>}></Route>
                <Route path = "mov/default" element={<Mov/>}></Route>
                <Route path = "projetos/default" element={<Projetos/>}></Route>
                <Route path = "secretaria/default" element={<Projetos/>}></Route>
                <Route path = "administracao/default" element={<Projetos/>}></Route>
                <Route path = "cadastros/exemplo2" element={<Cadastros/>}></Route>

                <Route path="/cadastros/alunos" element={<Alunos />} />
                <Route path="/cadastros/alunos/cadastro" element={<AlunosCadastro />} />
                
                <Route path="/cadastros/professores" element={<Professores />} />
                <Route path="/cadastros/professores/cadastro" element={<ProfessoresCadastro />} />
                <Route path="/cadastros/professores/cadastro/:id" element={<ProfessoresCadastro />} />
                
                <Route path="/cadastros/material-didatico" element={<MaterialDidatico />} />
                <Route path="/cadastros/material-didatico/cadastro" element={<MaterialDidaticoCadastro />} />
                <Route path="/cadastros/material-didatico/cadastro/:id" element={<MaterialDidaticoCadastro />} />
                
                <Route path="/cadastros/turmas" element={<Turmas />} />
                <Route path="/cadastros/turmas/cadastro" element={<TurmasCadastro />} />
                <Route path="/cadastros/turmas/cadastro/:id" element={<TurmasCadastro />} />
                
                <Route path="/cadastros/aulas" element={<Aulas />} />
                <Route path="/cadastros/aulas/cadastro" element={<AulasCadastro />} />
                <Route path="/cadastros/aulas/cadastro/:id" element={<AulasCadastro />} />
                
                <Route path="/agenda/default" element={<MinhaAgenda />} />
                
                <Route path="/movimentacoes/plano-aulas" element={<PlanoAulas />} />
                <Route path="/movimentacoes/presenca-faltas" element={<PresencaFaltas />} />
                
                <Route path="/projetos/leitura" element={<ProjetoLeitura />} />
                <Route path="/projetos/escrita" element={<ProjetoEscrita />} />
                
                <Route path="/administracao/unidade" element={<Unidade />} />
                <Route path="/administracao/grupos-acesso" element={<GruposAcesso />} />
                <Route path="/administracao/usuarios" element={<Usuarios />} />
                <Route path="/administracao/log-sistema" element={<LogSistema />} />
            </Route>
            <Route path="*" element={<Navigate to = "/"/>}></Route>
        </Routes>
    )
}