package br.com.cafeteria.dto;

import java.util.List;

public record CafeFinalResponse(String nomeFinal, List<String> composicao) {
}