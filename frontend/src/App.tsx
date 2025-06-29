import { useState, useEffect } from 'react';
import './App.css';

// --- INTERFACES E TIPOS ---
interface IngredienteDTO {
  id: number;
  nome: string;
  tipo: 'BASE' | 'ADICIONAL';
}

interface CafeFinalResponse {
  nomeFinal: string;
  ingredientesBase: string[];
  ingredientesAdicionais: string[];
}

// NOVO: Tipo para controlar as etapas do fluxo, agora mais detalhado
type Etapa = 'BASE' | 'ADICIONAIS' | 'RESUMO';

function App() {
  // --- ESTADOS DA APLICAÇÃO ---
  const [etapa, setEtapa] = useState<Etapa>('BASE');
  const [ingredientes, setIngredientes] = useState<IngredienteDTO[]>([]);
  const [selectedBaseIds, setSelectedBaseIds] = useState<Set<number>>(new Set());
  const [selectedAdicionalIds, setSelectedAdicionalIds] = useState<Set<number>>(new Set());
  const [cafeFinal, setCafeFinal] = useState<CafeFinalResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- EFEITOS (API CALLS) ---

  // Busca os ingredientes apenas uma vez
  useEffect(() => {
    fetch('/api/cafeteria/ingredientes')
      .then(res => res.ok ? res.json() : Promise.reject('Serviço indisponível.'))
      .then(data => setIngredientes(data))
      .catch((err) => setError(err.toString()));
  }, []);

  // --- FUNÇÕES DE MANIPULAÇÃO DE EVENTOS ---

  const handleSelectBase = (id: number) => {
    const newSelection = new Set(selectedBaseIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else if (newSelection.size < 3) {
      newSelection.add(id);
    } else {
      setError('Máximo de 3 ingredientes base.');
      setTimeout(() => setError(''), 2000);
    }
    setSelectedBaseIds(newSelection);
  };

  const handleSelectAdicional = (id: number) => {
    const newSelection = new Set(selectedAdicionalIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else if (newSelection.size < 2) {
      newSelection.add(id);
    } else {
      setError('Máximo de 2 ingredientes adicionais.');
      setTimeout(() => setError(''), 2000);
    }
    setSelectedAdicionalIds(newSelection);
  };
  
  const avancarParaAdicionais = () => {
    if (selectedBaseIds.size < 1) {
      setError('Selecione ao menos 1 ingrediente base.');
      setTimeout(() => setError(''), 2000);
      return;
    }
    setEtapa('ADICIONAIS');
  };

  const voltarParaBase = () => {
      setEtapa('BASE');
  };

  const montarCafeEAvancarParaResumo = () => {
    setIsLoading(true);
    setError('');

    const requestBody = {
      idsIngredientesBase: Array.from(selectedBaseIds),
      idsIngredientesAdicionais: Array.from(selectedAdicionalIds),
    };

    fetch('/api/cafeteria/montar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })
      .then(async res => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || 'Ocorreu um erro na montagem do café.');
        }
        return res.json();
      })
      .then(data => {
        setCafeFinal(data);
        setEtapa('RESUMO'); // Avança para a etapa de resumo
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  };
  
  const handleConfirmarPedido = () => {
    alert(`Pedido "${cafeFinal?.nomeFinal}" confirmado com sucesso!`);
    // Reseta tudo para o início
    setEtapa('BASE');
    setSelectedBaseIds(new Set());
    setSelectedAdicionalIds(new Set());
    setCafeFinal(null);
  };

  // --- RENDERIZAÇÃO ---
  const ingredientesBase = ingredientes.filter(i => i.tipo === 'BASE');
  const ingredientesAdicionais = ingredientes.filter(i => i.tipo === 'ADICIONAL');

  // Define as classes do Stepper
  const getStepClass = (stepName: Etapa) => {
      if (stepName === etapa) return 'active';
      if (etapa === 'ADICIONAIS' && stepName === 'BASE') return 'completed';
      if (etapa === 'RESUMO' && (stepName === 'BASE' || stepName === 'ADICIONAIS')) return 'completed';
      return '';
  };

  return (
    <div className="container">
      <header><h1>Monte seu Café ☕</h1><p>Escolha seus ingredientes e veja a mágica acontecer!</p></header>
      
      <div className="stepper-container">
        <div className={`step-item ${getStepClass('BASE')}`}><div className="step-circle">1</div><div className="step-label">Base</div></div>
        <div className={`step-connector ${etapa !== 'BASE' ? 'completed' : ''}`}></div>
        <div className={`step-item ${getStepClass('ADICIONAIS')}`}><div className="step-circle">2</div><div className="step-label">Adicionais</div></div>
        <div className={`step-connector ${etapa === 'RESUMO' ? 'completed' : ''}`}></div>
        <div className={`step-item ${getStepClass('RESUMO')}`}><div className="step-circle">3</div><div className="step-label">Fim</div></div>
      </div>

      <main className="montador">
        <section className="selecao">
          {/* ETAPA 1: SELEÇÃO DE BASE */}
          {etapa === 'BASE' && (
            <>
              <h2>1. Ingredientes Base</h2>
              <div className="ingrediente-lista">
                {ingredientesBase.map(ing => (
                  <button key={ing.id} className={selectedBaseIds.has(ing.id) ? 'selected' : ''} onClick={() => handleSelectBase(ing.id)} disabled={!selectedBaseIds.has(ing.id) && selectedBaseIds.size >= 3}>
                    {ing.nome}
                  </button>
                ))}
              </div>
              <div className="action-buttons">
                <button className="confirmar-etapa" onClick={avancarParaAdicionais} disabled={selectedBaseIds.size === 0}>
                  Confirmar Base
                </button>
              </div>
            </>
          )}

          {/* ETAPA 2: SELEÇÃO DE ADICIONAIS */}
          {etapa === 'ADICIONAIS' && (
            <>
              <h2>2. Ingredientes Adicionais</h2>
              <div className="ingrediente-lista">
                {ingredientesAdicionais.map(ing => (
                  <button key={ing.id} className={selectedAdicionalIds.has(ing.id) ? 'selected' : ''} onClick={() => handleSelectAdicional(ing.id)} disabled={!selectedAdicionalIds.has(ing.id) && selectedAdicionalIds.size >= 2}>
                    {ing.nome}
                  </button>
                ))}
              </div>
               <div className="action-buttons">
                <button className="voltar-etapa" onClick={voltarParaBase}>Voltar</button>
                <button className="confirmar-etapa" onClick={montarCafeEAvancarParaResumo}>Ver Resumo</button>
              </div>
            </>
          )}
        
          {/* ETAPA 3: RESUMO FINAL */}
          {etapa === 'RESUMO' && (
             <div className="resumo">
                <h2>Resumo do seu Café</h2>
                {isLoading && <p>Carregando...</p>}
                {error && <p className="error-message">{error}</p>}
                {cafeFinal && !isLoading && (
                    <div className="cafe-final-card">
                        <h3>{cafeFinal.nomeFinal}</h3>
                        <p>
                            <strong>Base:</strong> {cafeFinal.ingredientesBase.join(', ')}
                        </p>
                        {/* Renderiza a lista de adicionais apenas se ela não estiver vazia */}
                        {cafeFinal.ingredientesAdicionais.length > 0 && (
                            <p>
                                <strong>Adicionais:</strong> {cafeFinal.ingredientesAdicionais.join(', ')}
                            </p>
                        )}
                    </div>
                )}
                <div className="action-buttons">
                    <button className="voltar-etapa" onClick={() => setEtapa('ADICIONAIS')}>Voltar</button>
                    <button className="confirmar-pedido" disabled={!cafeFinal || isLoading} onClick={handleConfirmarPedido}>
                        Confirmar Pedido
                    </button>
                </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;