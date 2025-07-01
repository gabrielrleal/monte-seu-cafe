import { useEffect, useState } from "react";
import { type IngredienteDTO } from "../tipos";

export function useIngredientes() {
  const [ingredientes, setIngredientes] = useState<IngredienteDTO[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("/api/cafeteria/ingredientes")
      .then((res) => (res.ok ? res.json() : Promise.reject("Serviço indisponível.")))
      .then(setIngredientes)
      .catch((err) => setError(err.toString()));
  }, []);

  return { ingredientes, error };
}
