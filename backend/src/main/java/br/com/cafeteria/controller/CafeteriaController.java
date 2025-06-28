package br.com.cafeteria.controller;

import br.com.cafeteria.dto.CafeFinalResponse;
import br.com.cafeteria.dto.IngredienteDTO;
import br.com.cafeteria.dto.MontarCafeRequest;
import br.com.cafeteria.service.CafeteriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cafeteria")
public class CafeteriaController {

    private final CafeteriaService cafeteriaService;

    public CafeteriaController(CafeteriaService cafeteriaService) {
        this.cafeteriaService = cafeteriaService;
    }

    @GetMapping("/ingredientes")
    public ResponseEntity<List<IngredienteDTO>> listarIngredientes() {
        List<IngredienteDTO> ingredientes = cafeteriaService.listarTodosIngredientes();
        return ResponseEntity.ok(ingredientes);
    }

    @PostMapping("/montar")
    public ResponseEntity<?> montarCafe(@RequestBody MontarCafeRequest request) {
        try {
            CafeFinalResponse response = cafeteriaService.montarCafe(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}