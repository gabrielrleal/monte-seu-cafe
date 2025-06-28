-- Cria a tabela para as receitas
CREATE TABLE IF NOT EXISTS receita (
                                       id BIGSERIAL PRIMARY KEY,
                                       nome VARCHAR(100) NOT NULL UNIQUE
    );

-- Cria a tabela de junção para o relacionamento Muitos-para-Muitos
CREATE TABLE IF NOT EXISTS receita_ingrediente (
                                                   receita_id BIGINT NOT NULL,
                                                   ingrediente_id BIGINT NOT NULL,
                                                   PRIMARY KEY (receita_id, ingrediente_id),
    FOREIGN KEY (receita_id) REFERENCES receita(id),
    FOREIGN KEY (ingrediente_id) REFERENCES ingrediente(id)
    );

-- Insere as receitas clássicas
INSERT INTO receita (nome) VALUES ('Latte'), ('Mocha'), ('Macchiato'), ('Affogato');

-- Associa os ingredientes às receitas
-- Latte = Expresso + Leite
INSERT INTO receita_ingrediente (receita_id, ingrediente_id) VALUES
                                                                 ((SELECT id FROM receita WHERE nome = 'Latte'), (SELECT id FROM ingrediente WHERE nome = 'Expresso')),
                                                                 ((SELECT id FROM receita WHERE nome = 'Latte'), (SELECT id FROM ingrediente WHERE nome = 'Leite'));

-- Mocha = Expresso + Leite + Chocolate
INSERT INTO receita_ingrediente (receita_id, ingrediente_id) VALUES
                                                                 ((SELECT id FROM receita WHERE nome = 'Mocha'), (SELECT id FROM ingrediente WHERE nome = 'Expresso')),
                                                                 ((SELECT id FROM receita WHERE nome = 'Mocha'), (SELECT id FROM ingrediente WHERE nome = 'Leite')),
                                                                 ((SELECT id FROM receita WHERE nome = 'Mocha'), (SELECT id FROM ingrediente WHERE nome = 'Chocolate'));

-- Macchiato = Expresso + Leite + Espuma
INSERT INTO receita_ingrediente (receita_id, ingrediente_id) VALUES
                                                                 ((SELECT id FROM receita WHERE nome = 'Macchiato'), (SELECT id FROM ingrediente WHERE nome = 'Expresso')),
                                                                 ((SELECT id FROM receita WHERE nome = 'Macchiato'), (SELECT id FROM ingrediente WHERE nome = 'Leite')),
                                                                 ((SELECT id FROM receita WHERE nome = 'Macchiato'), (SELECT id FROM ingrediente WHERE nome = 'Espuma'));

-- Affogato = Sorvete + Expresso
INSERT INTO receita_ingrediente (receita_id, ingrediente_id) VALUES
                                                                 ((SELECT id FROM receita WHERE nome = 'Affogato'), (SELECT id FROM ingrediente WHERE nome = 'Sorvete')),
                                                                 ((SELECT id FROM receita WHERE nome = 'Affogato'), (SELECT id FROM ingrediente WHERE nome = 'Expresso'));