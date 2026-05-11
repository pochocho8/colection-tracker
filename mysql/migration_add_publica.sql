USE collection_db;

DROP PROCEDURE IF EXISTS add_publica_column;
DELIMITER //
CREATE PROCEDURE add_publica_column()
BEGIN
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = 'collection_db' AND TABLE_NAME = 'colecciones' AND COLUMN_NAME = 'publica'
    ) THEN
        ALTER TABLE colecciones ADD COLUMN publica TINYINT(1) DEFAULT 0;
    END IF;
END //
DELIMITER ;
CALL add_publica_column();
DROP PROCEDURE IF EXISTS add_publica_column;
