CREATE TABLE IF NOT EXISTS ingrediente (
                                           id BIGSERIAL PRIMARY KEY,
                                           nome VARCHAR(100) NOT NULL UNIQUE,
    tipo VARCHAR(50) NOT NULL
    );

TRUNCATE TABLE ingrediente RESTART IDENTITY;

INSERT INTO ingrediente (nome, tipo) VALUES
                                         ('Expresso', 'BASE'),
                                         ('Leite', 'BASE'),
                                         ('Chocolate', 'BASE'),
                                         ('Sorvete', 'BASE'),
                                         ('Espuma', 'BASE');

INSERT INTO ingrediente (nome, tipo) VALUES
                                         ('Caramelo', 'ADICIONAL'),
                                         ('Calda de Chocolate', 'ADICIONAL'),
                                         ('Chantilly', 'ADICIONAL'),
                                         ('Canela', 'ADICIONAL');