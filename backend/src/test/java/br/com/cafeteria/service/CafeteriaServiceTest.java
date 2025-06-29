package br.com.cafeteria.service;

import br.com.cafeteria.dto.CafeFinalResponse;
import br.com.cafeteria.dto.MontarCafeRequest;
import br.com.cafeteria.model.Ingrediente;
import br.com.cafeteria.model.Receita;
import br.com.cafeteria.repository.IngredienteRepository;
import br.com.cafeteria.repository.ReceitaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CafeteriaServiceTest {

    @Mock 
    private IngredienteRepository ingredienteRepository;

    @Mock 
    private ReceitaRepository receitaRepository;

    @InjectMocks 
    private CafeteriaService cafeteriaService;

    
    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(cafeteriaService, "minIngredientesBase", 1);
        ReflectionTestUtils.setField(cafeteriaService, "maxIngredientesBase", 3);
        ReflectionTestUtils.setField(cafeteriaService, "maxIngredientesAdicionais", 2);
    }

    @Test
    @DisplayName("Deve identificar um Latte corretamente quando os ingredientes base corretos são fornecidos")
    void deveIdentificarLatteCorretamente() {
      

        MontarCafeRequest request = new MontarCafeRequest(List.of(1L, 2L), Collections.emptyList());

        Ingrediente expresso = new Ingrediente();
        expresso.setId(1L);
        expresso.setNome("Expresso");

        Ingrediente leite = new Ingrediente();
        leite.setId(2L);
        leite.setNome("Leite");

        List<Ingrediente> ingredientesBase = List.of(expresso, leite);

        Receita receitaLatte = new Receita();
        receitaLatte.setNome("Latte");
        receitaLatte.setIngredientes(Set.of(expresso, leite));

        when(ingredienteRepository.findAllByIdIn(List.of(1L, 2L))).thenReturn(ingredientesBase);
        when(receitaRepository.findAll()).thenReturn(List.of(receitaLatte));

        CafeFinalResponse response = cafeteriaService.montarCafe(request);

 
        assertNotNull(response);
        assertEquals("Latte", response.nomeFinal());
        assertTrue(response.ingredientesBase().containsAll(List.of("Expresso", "Leite")));
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar montar café com mais de 3 ingredientes base")
    void deveLancarExcecaoComMaisDe3IngredientesBase() {
        MontarCafeRequest requestInvalida = new MontarCafeRequest(List.of(1L, 2L, 3L, 4L), Collections.emptyList());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> cafeteriaService.montarCafe(requestInvalida)
        );

        assertEquals("A seleção de ingredientes base deve conter de 1 a 3 itens.", exception.getMessage());
    }


    @Test
    @DisplayName("Deve lançar exceção ao tentar montar café com mais de 2 ingredientes adicionais")
    void deveLancarExcecaoAoMontarCafeComMaisDe2Adicionais() {
        MontarCafeRequest requestInvalida = new MontarCafeRequest(List.of(1L), List.of(6L, 7L, 8L));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> cafeteriaService.montarCafe(requestInvalida)
        );

        assertEquals("A seleção de ingredientes adicionais não pode exceder 2 itens.", exception.getMessage());
    }

    @Test
    @DisplayName("Deve retornar 'Café Personalizado' quando a combinação de base não for clássica")
    void deveRetornarCafePersonalizadoQuandoCombinacaoNaoForClassica() {
        MontarCafeRequest request = new MontarCafeRequest(List.of(3L, 5L), Collections.emptyList());

        Ingrediente chocolate = new Ingrediente();
        chocolate.setId(3L);
        chocolate.setNome("Chocolate");

        Ingrediente espuma = new Ingrediente();
        espuma.setId(5L);
        espuma.setNome("Espuma");

        List<Ingrediente> ingredientesBase = List.of(chocolate, espuma);

        when(ingredienteRepository.findAllByIdIn(List.of(3L, 5L))).thenReturn(ingredientesBase);
        when(receitaRepository.findAll()).thenReturn(Collections.emptyList());

        CafeFinalResponse response = cafeteriaService.montarCafe(request);

        assertNotNull(response);
        assertEquals("Café Personalizado", response.nomeFinal());
    }

    @Test
    @DisplayName("Deve montar um café clássico com adicionais corretamente")
    void deveMontarCafeClassicoComAdicionaisCorretamente() {
     
        MontarCafeRequest request = new MontarCafeRequest(List.of(1L, 2L, 3L), List.of(9L));

        Ingrediente expresso = new Ingrediente(); expresso.setId(1L); expresso.setNome("Expresso");
        Ingrediente leite = new Ingrediente(); leite.setId(2L); leite.setNome("Leite");
        Ingrediente chocolate = new Ingrediente(); chocolate.setId(3L); chocolate.setNome("Chocolate");
        Ingrediente canela = new Ingrediente(); canela.setId(9L); canela.setNome("Canela");

        List<Ingrediente> ingredientesBase = List.of(expresso, leite, chocolate);
        List<Ingrediente> ingredientesAdicionais = List.of(canela);

        Receita receitaMocha = new Receita();
        receitaMocha.setNome("Mocha");
        receitaMocha.setIngredientes(Set.of(expresso, leite, chocolate));

        when(ingredienteRepository.findAllByIdIn(request.idsIngredientesBase())).thenReturn(ingredientesBase);
        when(ingredienteRepository.findAllByIdIn(request.idsIngredientesAdicionais())).thenReturn(ingredientesAdicionais);
        when(receitaRepository.findAll()).thenReturn(List.of(receitaMocha));

        CafeFinalResponse response = cafeteriaService.montarCafe(request);

        assertNotNull(response);
        assertEquals("Mocha com Canela", response.nomeFinal());
        assertTrue(response.ingredientesBase().containsAll(List.of("Expresso", "Leite", "Chocolate")));
        assertTrue(response.ingredientesAdicionais().contains("Canela"));
    }


}