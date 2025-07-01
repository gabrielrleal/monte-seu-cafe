import { useState, useEffect } from "react";
import { type Etapa } from "./tipos";
import { useIngredientes } from "./hooks/useIngredientes";
import { useMontarCafe } from "./hooks/useMontarCafe";
import "./App.css";

function App() {
  // --- ESTADOS DA APLICAÇÃO ---
  const [etapa, setEtapa] = useState<Etapa>("BASE");
  const [selectedBaseIds, setSelectedBaseIds] = useState<Set<number>>(new Set());
  const [selectedAdicionalIds, setSelectedAdicionalIds] = useState<Set<number>>(new Set());

  // --- HOOKS DE DADOS ---
  const { ingredientes } = useIngredientes();
  const { cafeFinal, isLoading, montarCafe } = useMontarCafe();
  const [error, setError] = useState<string>("");

  // --- DICIONÁRIO DE TEXTOS GUIADOS ---
  const textosDeEtapa = {
    BASE: "Passo 1 de 3: Selecione de 1 a 3 ingredientes para a base do seu café.",
    ADICIONAIS: "Passo 2 de 3: Adicione até 2 ingredientes extras para personalizar.",
    RESUMO: "Passo 3 de 3: Revise e confirme seu pedido especial!",
    SUCESSO: "Seu pedido foi realizado! Obrigado!",
  };

  // --- EFEITO PARA MONTAR CAFÉ SEMPRE QUE SELEÇÃO MUDA ---
  useEffect(() => {
    montarCafe(Array.from(selectedBaseIds), Array.from(selectedAdicionalIds));
  }, [selectedBaseIds, selectedAdicionalIds, montarCafe]);

  // --- FUNÇÕES DE MANIPULAÇÃO DE EVENTOS ---
  const handleSelectBase = (id: number) => {
    const newSelection = new Set(selectedBaseIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else if (newSelection.size < 3) newSelection.add(id);
    else {
      setError("Máximo de 3 ingredientes base.");
      setTimeout(() => setError(""), 3000);
    }
    setSelectedBaseIds(newSelection);
  };

  const handleSelectAdicional = (id: number) => {
    const newSelection = new Set(selectedAdicionalIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else if (newSelection.size < 2) newSelection.add(id);
    else {
      setError("Máximo de 2 ingredientes adicionais.");
      setTimeout(() => setError(""), 3000);
    }
    setSelectedAdicionalIds(newSelection);
  };

  const avancarParaAdicionais = () => {
    if (selectedBaseIds.size < 1) {
      setError("Selecione ao menos 1 ingrediente base.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setEtapa("ADICIONAIS");
  };

  const handleConfirmarPedido = () => {
    setEtapa("SUCESSO");
  };

  const handleReset = () => {
    setEtapa("BASE");
    setSelectedBaseIds(new Set());
    setSelectedAdicionalIds(new Set());
    setError("");
  };

  // --- RENDERIZAÇÃO ---
  const ingredientesBase = ingredientes.filter((i) => i.tipo === "BASE");
  const ingredientesAdicionais = ingredientes.filter((i) => i.tipo === "ADICIONAL");

  const getStepClass = (stepName: Etapa) => {
    if (etapa === "SUCESSO") return "completed";
    if (stepName === etapa) return "active";
    if ((etapa === "ADICIONAIS" || etapa === "RESUMO") && stepName === "BASE")
      return "completed";
    if (etapa === "RESUMO" && stepName === "ADICIONAIS") return "completed";
    return "";
  };

  const getConnectorClass = (stepNumber: number) => {
    if (
      stepNumber === 1 &&
      (etapa === "ADICIONAIS" || etapa === "RESUMO" || etapa === "SUCESSO")
    )
      return "completed";
    if (stepNumber === 2 && (etapa === "RESUMO" || etapa === "SUCESSO"))
      return "completed";
    return "";
  };

  const renderCurrentStep = () => {
    if (etapa === "SUCESSO") {
      return (
        <div className="success-message">
          <h2>Pedido Realizado com Sucesso! ✅</h2>
          <p>Seu café "{cafeFinal?.nomeFinal}" já está sendo preparado!</p>
          <div className="action-buttons">
            <button
              className="confirmar-etapa"
              style={{ width: "auto" }}
              onClick={handleReset}
            >
              Montar Outro Café
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {etapa === "BASE" && (
          <>
            <h2>1. Selecione os Ingredientes Base</h2>
            <div className="ingrediente-lista">
              {ingredientesBase.map((ing) => (
                <button
                  key={ing.id}
                  className={selectedBaseIds.has(ing.id) ? "selected" : ""}
                  onClick={() => handleSelectBase(ing.id)}
                  disabled={
                    !selectedBaseIds.has(ing.id) && selectedBaseIds.size >= 3
                  }
                >
                  {ing.nome}
                </button>
              ))}
            </div>
            <div className="action-buttons">
              {" "}
              <button
                className="confirmar-etapa"
                style={{ width: "100%" }}
                onClick={avancarParaAdicionais}
                disabled={selectedBaseIds.size === 0}
              >
                Confirmar Base e ir para Adicionais
              </button>{" "}
            </div>
          </>
        )}

        {etapa === "ADICIONAIS" && (
          <>
            <h2>2. Escolha seus Adicionais (Opcional)</h2>
            <div className="ingrediente-lista">
              {ingredientesAdicionais.map((ing) => (
                <button
                  key={ing.id}
                  className={selectedAdicionalIds.has(ing.id) ? "selected" : ""}
                  onClick={() => handleSelectAdicional(ing.id)}
                  disabled={
                    !selectedAdicionalIds.has(ing.id) &&
                    selectedAdicionalIds.size >= 2
                  }
                >
                  {ing.nome}
                </button>
              ))}
            </div>
            <div className="action-buttons">
              <button className="voltar-etapa" onClick={() => setEtapa("BASE")}>
                Voltar
              </button>
              <button
                className="confirmar-etapa"
                onClick={() => setEtapa("RESUMO")}
              >
                Revisar Pedido
              </button>
            </div>
          </>
        )}

        {etapa === "RESUMO" && (
          <div>
            <h2>3. Confirme seu Pedido</h2>
            <p>Por favor, revise seu café personalizado antes de finalizar.</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="container">
      <header>
        <h1>Monte seu Café</h1>
        <p>{textosDeEtapa[etapa]}</p>
      </header>

      <div
        className="action-buttons"
        style={{ justifyContent: "flex-end", paddingBottom: "1rem" }}
      >
        {}
        {(etapa === "BASE" || etapa === "ADICIONAIS" || etapa === "RESUMO") && (
          <button className="voltar-etapa" onClick={handleReset}>
            Limpar e Começar de Novo
          </button>
        )}
      </div>

      <div className="stepper-container">
        <div className={`step-item ${getStepClass("BASE")}`}>
          <div className="step-circle">1</div>
          <div className="step-label">Base</div>
        </div>
        <div className={`step-connector ${getConnectorClass(1)}`}></div>
        <div className={`step-item ${getStepClass("ADICIONAIS")}`}>
          <div className="step-circle">2</div>
          <div className="step-label">Adicionais</div>
        </div>
        <div className={`step-connector ${getConnectorClass(2)}`}></div>
        <div className={`step-item ${getStepClass("RESUMO")}`}>
          <div className="step-circle">3</div>
          <div className="step-label">Fim</div>
        </div>
      </div>

      <main className="montador">
        <section className="selecao">
          <div className="wizard-card">{renderCurrentStep()}</div>
        </section>

        <aside className="resumo">
          <h2>Resumo do seu Café</h2>
          {isLoading ? (
            <p>Atualizando...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : cafeFinal ? (
            <div className="cafe-final-card">
              <h3>{cafeFinal.nomeFinal}</h3>
              <p>
                <strong>Base:</strong> {cafeFinal.ingredientesBase.join(", ")}
              </p>
              {cafeFinal.ingredientesAdicionais.length > 0 && (
                <p>
                  <strong>Adicionais:</strong>{" "}
                  {cafeFinal.ingredientesAdicionais.join(", ")}
                </p>
              )}
            </div>
          ) : (
            <p>Selecione ao menos um ingrediente base para começar.</p>
          )}
          {etapa === "RESUMO" && (
            <div className="action-buttons">
              <button
                className="voltar-etapa"
                onClick={() => setEtapa("ADICIONAIS")}
              >
                Voltar
              </button>
              <button
                className="confirmar-pedido"
                disabled={!cafeFinal || isLoading}
                onClick={handleConfirmarPedido}
              >
                Confirmar Pedido
              </button>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
