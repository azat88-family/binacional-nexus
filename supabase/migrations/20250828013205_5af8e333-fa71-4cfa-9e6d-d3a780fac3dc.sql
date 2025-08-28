-- Adicionar dados de exemplo na tabela rooms
INSERT INTO rooms (id, number, status) VALUES 
(1, 101, 'available'),
(2, 102, 'available'), 
(3, 103, 'occupied'),
(4, 201, 'available'),
(5, 202, 'maintenance'),
(6, 203, 'available'),
(7, 301, 'cleaning'),
(8, 302, 'available'),
(9, 303, 'available'),
(10, 401, 'available')
ON CONFLICT (id) DO NOTHING;