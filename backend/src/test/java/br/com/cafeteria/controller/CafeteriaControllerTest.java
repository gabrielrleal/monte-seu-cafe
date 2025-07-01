package br.com.cafeteria.controller;

import br.com.cafeteria.dto.CafeFinalResponse;
import br.com.cafeteria.dto.MontarCafeRequest;
import br.com.cafeteria.service.CafeteriaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CafeteriaController.class)
class CafeteriaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CafeteriaService cafeteriaService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Deve retornar 200 e o nome do café ao montar café válido")
    void deveRetornar200AoMontarCafeValido() throws Exception {
        MontarCafeRequest request = new MontarCafeRequest(List.of(1L, 2L), List.of(3L));
        CafeFinalResponse response = new CafeFinalResponse("Latte", List.of("Expresso", "Leite"), List.of("Chocolate"));

        Mockito.when(cafeteriaService.montarCafe(any())).thenReturn(response);

        mockMvc.perform(post("/api/cafeteria/montar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomeFinal").value("Latte"))
                .andExpect(jsonPath("$.ingredientesBase").isArray())
                .andExpect(jsonPath("$.ingredientesAdicionais").isArray());
    }

    @Test
    @DisplayName("Deve retornar 400 ao tentar montar café inválido")
    void deveRetornar400AoMontarCafeInvalido() throws Exception {
        MontarCafeRequest request = new MontarCafeRequest(List.of(1L, 2L, 3L, 4L), List.of());
        Mockito.when(cafeteriaService.montarCafe(any())).thenThrow(new IllegalArgumentException("A seleção de ingredientes base deve conter de 1 a 3 itens."));

        mockMvc.perform(post("/api/cafeteria/montar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
