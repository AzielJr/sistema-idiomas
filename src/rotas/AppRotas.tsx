import { Navigate, Route, Routes } from "react-router-dom";
import LayoutPrincipal from "../components/LayoutPrincipal";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import DashboardNovo from "../pages/DashboardNovo";
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
import PlanoAulaCadastro from "../pages/PlanoAulaCadastro";
import PresencaFaltas from "../pages/PresencaFaltas";
import ProjetoLeitura from "../pages/ProjetoLeitura";
import ProjetoEscrita from "../pages/ProjetoEscrita";
import Unidade from "../pages/Unidade";
import UnidadesCadastro from "../pages/UnidadesCadastro";
import GruposAcesso from "../pages/GruposAcesso";
import Usuarios from "../pages/Usuarios";
import LogSistema from "../pages/LogSistema"; 
import Matriculas from "../pages/Matriculas";
import Solicitacoes from "../pages/Solicitacoes";
import EstoqueMaterial from "../pages/EstoqueMaterial";
import PedidosMaterial from "../pages/PedidosMaterial";
import Mensalidades from "../pages/Mensalidades";
import Despesas from "../pages/Despesas";
import TiposDespesa from "../pages/TiposDespesa";

export default function AppRotas(){
    return(
        <Routes>
            {/* Rota de Login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rotas Protegidas */}
            <Route path="/" element={
                <ProtectedRoute>
                    <LayoutPrincipal/>
                </ProtectedRoute>
            }>
                <Route index element={<DashboardNovo/>}></Route>
                <Route path = "dashboard/default" element={<DashboardNovo/>}></Route>
                <Route path = "cadastros/default" element={<Cadastros/>}></Route>
                <Route path = "mov/default" element={<Mov/>}></Route>
                <Route path = "projetos/default" element={<Projetos/>}></Route>
                <Route path = "secretaria/default" element={<Projetos/>}></Route>
                <Route path = "administracao/default" element={<Projetos/>}></Route>
                <Route path = "cadastros/exemplo2" element={<Cadastros/>}></Route>

                <Route path="/cadastros/alunos" element={<Alunos />} />
                <Route path="/cadastros/alunos/cadastro" element={<AlunosCadastro />} />
                <Route path="/cadastros/alunos/cadastro/:id" element={<AlunosCadastro />} />
                
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
                
                <Route path="/movimentacoes/plano-aulas" element={<PlanoAulas />} />
                <Route path="/plano-aulas" element={<PlanoAulas />} />
                <Route path="/plano-aulas/cadastro" element={<PlanoAulaCadastro />} />
                <Route path="/plano-aulas/:id" element={<PlanoAulaCadastro />} />
                <Route path="/plano-aulas/:id/editar" element={<PlanoAulaCadastro />} />
                <Route path="/movimentacoes/presenca-faltas" element={<PresencaFaltas />} />
                
                <Route path="/projetos/leitura" element={<ProjetoLeitura />} />
                <Route path="/projetos/escrita" element={<ProjetoEscrita />} />
                
                <Route path="/administracao/unidade" element={<Unidade />} />
                <Route path="/administracao/unidade/cadastro" element={<UnidadesCadastro />} />
                <Route path="/administracao/unidade/cadastro/:id" element={<UnidadesCadastro />} />
                <Route path="/administracao/grupos-acesso" element={<GruposAcesso />} />
                <Route path="/administracao/usuarios" element={<Usuarios />} />
                <Route path="/administracao/log-sistema" element={<LogSistema />} />
                
                {/* Rotas Secretaria e ADM */}
                <Route path="/secretaria-adm/matriculas" element={<Matriculas />} />
                <Route path="/secretaria-adm/solicitacoes" element={<Solicitacoes />} />
                <Route path="/secretaria-adm/estoque-material" element={<EstoqueMaterial />} />
                <Route path="/secretaria-adm/pedidos-material" element={<PedidosMaterial />} />
                
                {/* Rotas Financeiro */}
                <Route path="/financeiro/mensalidades" element={<Mensalidades />} />
                <Route path="/financeiro/despesas" element={<Despesas />} />
                <Route path="/financeiro/tipos-despesa" element={<TiposDespesa />} />
            </Route>
            
            {/* Redirecionamento padrão */}
            <Route path="*" element={<Navigate to = "/login"/>}></Route>
        </Routes>
    )
}