import { useCallback, useState } from "react";
import { type CafeFinalResponse } from "../tipos";

export function useMontarCafe() {
  const [cafeFinal, setCafeFinal] = useState<CafeFinalResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const montarCafe = useCallback((idsBase: number[], idsAdicionais: number[]) => {
    if (idsBase.length === 0) {
      setCafeFinal(null);
      return;
    }
    setIsLoading(true);
    setError("");
    const requestBody = {
      idsIngredientesBase: idsBase,
      idsIngredientesAdicionais: idsAdicionais,
    };
    fetch("/api/cafeteria/montar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Erro na montagem.");
        }
        return res.json();
      })
      .then((data) => setCafeFinal(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { cafeFinal, error, isLoading, montarCafe };
}
