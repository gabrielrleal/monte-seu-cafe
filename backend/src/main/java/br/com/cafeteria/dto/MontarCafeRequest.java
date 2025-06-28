package br.com.cafeteria.dto;

import java.util.List;

public record MontarCafeRequest(List<Long> idsIngredientesBase, List<Long> idsIngredientesAdicionais) {
}