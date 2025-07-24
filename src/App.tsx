import { Routes, Route } from 'react-router-dom';
import PaginaClientes from "./pages/PaginaClientes"
import PaginaDetalhesCliente from './pages/PaginaDetalhesCliente'; 

function App() {
  return (
    <Routes>
      {/* Rota para a lista de clientes (página inicial) */}
      <Route path="/" element={<PaginaClientes />} />
      
      {/* Rota para os detalhes de um cliente específico */}
      {/* Por enquanto, vamos colocar um texto simples para testar */}
      <Route path="/clientes/:id" element={<PaginaDetalhesCliente />} />
    </Routes>
  );
}

export default App;