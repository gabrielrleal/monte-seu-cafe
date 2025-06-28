package br.com.cafeteria.service;

import br.com.cafeteria.dto.CafeFinalResponse;
import br.com.cafeteria.dto.IngredienteDTO;
import br.com.cafeteria.dto.MontarCafeRequest;
import br.com.cafeteria.model.Ingrediente;
import br.com.cafeteria.model.Receita;
import br.com.cafeteria.repository.IngredienteRepository;
import br.com.cafeteria.repository.ReceitaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class CafeteriaService {

    // Injeta os valores do application.properties para as regras de negócio
    @Value("${cafeteria.regras.ingredientes-base.min}")
    private int minIngredientesBase;

    @Value("${cafeteria.regras.ingredientes-base.max}")
    private int maxIngredientesBase;

    @Value("${cafeteria.regras.ingredientes-adicionais.max}")
    private int maxIngredientesAdicionais;

    private final IngredienteRepository ingredienteRepository;
    private final ReceitaRepository receitaRepository;

    public CafeteriaService(IngredienteRepository ingredienteRepository, ReceitaRepository receitaRepository) {
        this.ingredienteRepository = ingredienteRepository;
        this.receitaRepository = receitaRepository;
    }

    public List<IngredienteDTO> listarTodosIngredientes() {
        return ingredienteRepository.findAll().stream()
                .map(ing -> new IngredienteDTO(ing.getId(), ing.getNome(), ing.getTipo().name()))
                .collect(Collectors.toList());
    }

    public CafeFinalResponse montarCafe(MontarCafeRequest request) {
        // Validação das regras de negócio usando os valores injetados
        if (request.idsIngredientesBase() == null || request.idsIngredientesBase().size() < minIngredientesBase || request.idsIngredientesBase().size() > maxIngredientesBase) {
            throw new IllegalArgumentException("A seleção de ingredientes base deve conter de " + minIngredientesBase + " a " + maxIngredientesBase + " itens.");
        }
        if (request.idsIngredientesAdicionais() != null && request.idsIngredientesAdicionais().size() > maxIngredientesAdicionais) {
            throw new IllegalArgumentException("A seleção de ingredientes adicionais não pode exceder " + maxIngredientesAdicionais + " itens.");
        }

        List<Ingrediente> ingredientesBase = ingredienteRepository.findAllByIdIn(request.idsIngredientesBase());
        List<Ingrediente> ingredientesAdicionais = Optional.ofNullable(request.idsIngredientesAdicionais())
                .map(ingredienteRepository::findAllByIdIn)
                .orElse(Collections.emptyList());

        if (ingredientesBase.size() != request.idsIngredientesBase().size()) {
            throw new IllegalArgumentException("Um ou mais IDs de ingredientes base não foram encontrados.");
        }

        // Lógica de identificação de receita
        String nomeBase = identificarSaborClassico(ingredientesBase);

        // Lógica para gerar nome final e composição
        List<String> nomesIngredientesAdicionais = ingredientesAdicionais.stream().map(Ingrediente::getNome).collect(Collectors.toList());
        String nomeFinal = nomeBase;
        if (!nomesIngredientesAdicionais.isEmpty()) {
            nomeFinal += " com " + String.join(" e ", nomesIngredientesAdicionais);
        }

        List<String> composicaoFinal = Stream.concat(
                ingredientesBase.stream().map(Ingrediente::getNome),
                ingredientesAdicionais.stream().map(Ingrediente::getNome)
        ).sorted().collect(Collectors.toList());

        return new CafeFinalResponse(nomeFinal, composicaoFinal);
    }

    private String identificarSaborClassico(List<Ingrediente> ingredientesBase) {
        Set<String> nomesIngredientesSelecionados = ingredientesBase.stream()
                .map(Ingrediente::getNome)
                .collect(Collectors.toSet());

        List<Receita> todasReceitas = receitaRepository.findAll();

        for (Receita receita : todasReceitas) {
            Set<String> nomesIngredientesDaReceita = receita.getIngredientes().stream()
                    .map(Ingrediente::getNome)
                    .collect(Collectors.toSet());

            if (nomesIngredientesDaReceita.equals(nomesIngredientesSelecionados)) {
                return receita.getNome();
            }
        }

        return "Café Personalizado";
    }
}