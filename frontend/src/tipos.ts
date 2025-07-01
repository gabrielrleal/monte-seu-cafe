export interface IngredienteDTO {
  id: number;
  nome: string;
  tipo: "BASE" | "ADICIONAL";
}

export interface CafeFinalResponse {
  nomeFinal: string;
  ingredientesBase: string[];
  ingredientesAdicionais: string[];
}

export type Etapa = "BASE" | "ADICIONAIS" | "RESUMO" | "SUCESSO";
