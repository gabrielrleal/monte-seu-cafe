package br.com.cafeteria.integration;

import br.com.cafeteria.dto.CafeFinalResponse;
import br.com.cafeteria.dto.MontarCafeRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class CafeteriaIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    @DisplayName("Fluxo completo: montar café válido retorna 200 e resposta correta")
    void fluxoCompletoMontarCafeValido() {
        MontarCafeRequest request = new MontarCafeRequest(List.of(1L, 2L), List.of(3L));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<MontarCafeRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<CafeFinalResponse> response = restTemplate.postForEntity(
                "/api/cafeteria/montar", entity, CafeFinalResponse.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().nomeFinal());
        assertNotNull(response.getBody().ingredientesBase());
    }

    @Test
    @DisplayName("Fluxo completo: montar café inválido retorna 400")
    void fluxoCompletoMontarCafeInvalido() {
        MontarCafeRequest request = new MontarCafeRequest(List.of(1L, 2L, 3L, 4L), List.of());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<MontarCafeRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/cafeteria/montar", entity, String.class);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("A seleção de ingredientes base deve conter"));
    }
}
