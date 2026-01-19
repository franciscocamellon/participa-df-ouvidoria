-- 1) Sequence
CREATE SEQUENCE IF NOT EXISTS ombudsman_protocol_seq START 1;

-- 2) Backfill para registros antigos sem protocolo
UPDATE ombudsman
SET protocol_number =
        'DF-' || EXTRACT(YEAR FROM NOW())::int || '-' || LPAD(nextval('ombudsman_protocol_seq')::text, 6, '0')
WHERE protocol_number IS NULL OR protocol_number = '';

-- 3) NOT NULL
ALTER TABLE ombudsman
    ALTER COLUMN protocol_number SET NOT NULL;

-- 4) Trocar índice antigo por UNIQUE
DROP INDEX IF EXISTS idx_ombudsman_protocol_number;

CREATE UNIQUE INDEX IF NOT EXISTS ux_ombudsman_protocol_number
    ON ombudsman (protocol_number);
