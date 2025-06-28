package br.com.cafeteria.repository;

import br.com.cafeteria.model.Ingrediente; // <-- Importa do pacote 'model'
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {

    List<Ingrediente> findAllByIdIn(List<Long> ids);
}