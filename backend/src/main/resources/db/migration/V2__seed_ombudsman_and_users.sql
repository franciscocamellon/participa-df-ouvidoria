-- =====================================================================
-- V2__seed_ombudsman_plano_piloto_and_users.sql
-- Seeds:
--  - +2 users (same profile/hash as Maria) for variety
--  - destination_agencies (basic set)
--  - 30 Ombudsman cases (varied completeness) with locations in Plano Piloto/DF
--  - status history entries referencing Joao (agent) in changed_by_user_id
--  - attachment URLs (0..4) per case, optional and varied
-- =====================================================================

-- -----------------------
-- 1) Extra users (like Maria)
-- -----------------------
-- Maria password_hash (copied from V1): Maria@123!
-- role/status/email_verified/created/updated aligned with Maria seed

INSERT INTO users (
    full_name,
    email,
    password_hash,
    role,
    status,
    email_verified_at,
    failed_login_attempts,
    locked_until,
    last_login_at,
    phone_e164,
    created_at,
    updated_at
)
VALUES
    (
        'Francisco Admin',
        'admin@softkit.local',
        '$2b$10$UvXMaTA8FWWUz99b/UZnxOyOQSFwUpgakYJnW98z159iac9WYNmBy',
        'ADMIN',
        'ACTIVE',
        CURRENT_TIMESTAMP(3) - INTERVAL '60 days',
        0,
        NULL,
        CURRENT_TIMESTAMP(3) - INTERVAL '1 day',
        '+5511999990001',
        CURRENT_TIMESTAMP(3) - INTERVAL '60 days',
        CURRENT_TIMESTAMP(3) - INTERVAL '1 day'
    ),
    (
        'Maria Souza',
        'maria@softkit.local',
        '$2b$10$rwMT1bd2jLeApPdIqwBwd.h2m.2cuBVzx4eyppFRl076J05./zMxS',
        'CUSTOMER',
        'ACTIVE',
        CURRENT_TIMESTAMP(3) - INTERVAL '20 days',
        0,
        NULL,
        CURRENT_TIMESTAMP(3) - INTERVAL '2 days',
        '+5511999990002',
        CURRENT_TIMESTAMP(3) - INTERVAL '20 days',
        CURRENT_TIMESTAMP(3) - INTERVAL '2 days'
    ),
    (
        'João Pereira',
        'joao@softkit.local',
        '$2b$10$1d62QlVAwQA5DtWhfZuc9OIe8mtQf0D3a.HdmBkg.3gXWFvutU/7S',
        'AGENT',
        'ACTIVE',
        CURRENT_TIMESTAMP(3) - INTERVAL '20 days',
        0,
        NULL,
        CURRENT_TIMESTAMP(3) - INTERVAL '4 days',
        NULL,
        CURRENT_TIMESTAMP(3) - INTERVAL '3 days',
        CURRENT_TIMESTAMP(3) - INTERVAL '3 days'
    ),
    (
        'Ana Lima',
        'ana.lima@softkit.local',
        '$2b$10$rwMT1bd2jLeApPdIqwBwd.h2m.2cuBVzx4eyppFRl076J05./zMxS',
        'CUSTOMER',
        'ACTIVE',
        CURRENT_TIMESTAMP(3) - INTERVAL '18 days',
        0,
        NULL,
        CURRENT_TIMESTAMP(3) - INTERVAL '1 days',
        '+5561999991001',
        CURRENT_TIMESTAMP(3) - INTERVAL '18 days',
        CURRENT_TIMESTAMP(3) - INTERVAL '1 days'
    ),
    (
        'Carlos Oliveira',
        'carlos.oliveira@softkit.local',
        '$2b$10$rwMT1bd2jLeApPdIqwBwd.h2m.2cuBVzx4eyppFRl076J05./zMxS',
        'CUSTOMER',
        'ACTIVE',
        CURRENT_TIMESTAMP(3) - INTERVAL '12 days',
        0,
        NULL,
        CURRENT_TIMESTAMP(3) - INTERVAL '3 days',
        '+5561999991002',
        CURRENT_TIMESTAMP(3) - INTERVAL '12 days',
        CURRENT_TIMESTAMP(3) - INTERVAL '3 days'
    )
    ON CONFLICT (email) DO NOTHING;

-- -----------------------
-- 2) Ombudsman + StatusHistory + AttachmentUrls (30 varied cases)
-- -----------------------
DO $$
DECLARE
    joao_id uuid;
    maria_id uuid;
    ana_id uuid;
    carlos_id uuid;

    case_id uuid;
    proto text;

    cats text[] := ARRAY['URBAN_MAINTENANCE','LIGHTING','WASTE_DISPOSAL','URBAN_FURNITURE','INCIDENT','ACCESSIBILITY','VULNERABILITY', 'ENVIRONMENTAL'];
    urg  text[] := ARRAY['LOW','MEDIUM','HIGH','CRITICAL'];
    statuses text[] := ARRAY['RECEIVED','TRIAGE','FORWARDED','IN_EXECUTION','SCHEDULED','COMPLETED'];

    lons numeric[] := ARRAY[
    -47.882500, -47.899000, -47.916000, -47.871000, -47.933000,
    -47.897800, -47.889300, -47.905200, -47.875900, -47.912300,
    -47.893700, -47.879400, -47.908900, -47.901100, -47.885100,
    -47.919800, -47.872800, -47.930900, -47.898400, -47.910700,
    -47.884000, -47.892100, -47.906600, -47.873900, -47.915500,
    -47.900400, -47.887200, -47.923600, -47.878600, -47.909900
  ];
  lats numeric[] := ARRAY[
    -15.793900, -15.800000, -15.809000, -15.780000, -15.779000,
    -15.796200, -15.787700, -15.804300, -15.794600, -15.806100,
    -15.803900, -15.791200, -15.799800, -15.812200, -15.785900,
    -15.796900, -15.808700, -15.790500, -15.814100, -15.802500,
    -15.799100, -15.788600, -15.792700, -15.806900, -15.810400,
    -15.783600, -15.797500, -15.804900, -15.812800, -15.789400
  ];

  -- 30 descrições no estilo "cidadão"
  descs text[] := ARRAY[
    'Tem um buraco grande na via e os carros estão desviando em cima da faixa. Quase tive um acidente hoje cedo.',
    'Poste de iluminação apagado há dias. A rua fica muito escura à noite e dá insegurança.',
    'Acúmulo de lixo e entulho na calçada. O mau cheiro está forte e atrai insetos.',
    'Bueiro entupido: quando chove alaga e a água volta para a pista. Precisa limpeza urgente.',
    'Árvore com galhos baixos invadindo a calçada, dificultando passagem (cadeirante/idoso). Precisa poda.',
    'Semáforo parece desregulado: fica muito tempo fechado e forma fila enorme no horário de pico.',
    'Faixa de pedestres apagada. Motoristas não respeitam e é perigoso atravessar.',
    'Ponto de ônibus sem cobertura e com banco quebrado. Em dia de chuva é impossível esperar.',
    'Barulho excessivo de obra fora do horário permitido. Começa muito cedo e atrapalha moradores.',
    'Sinalização de trânsito confusa depois de uma mudança recente. Já vi quase colisão no cruzamento.',
    'Vazamento de água na calçada há pelo menos uma semana. Está escorrendo e abrindo um buraco.',
    'Iluminação do parque muito fraca à noite. Falta manutenção nas lâmpadas e refletores.',
    'Mato alto em área pública. Está virando esconderijo e juntando lixo.',
    'Pichação e depredação em equipamento público. Precisa limpeza e reparo.',
    'Carro abandonado há meses ocupando vaga e acumulando sujeira ao redor.',
    'Falta de acessibilidade: rampa quebrada e piso irregular, impossível passar com carrinho/cadeira.',
    'Transporte público atrasando muito. Ônibus passa lotado e intervalos muito longos.',
    'Foco de mosquito: água parada em área pública com pneus e recipientes. Precisa remoção.',
    'Lâmpadas piscando à noite (parece mau contato). Dá sensação de insegurança e incomoda.',
    'Buraco na calçada com risco de queda. Uma pessoa já tropeçou aqui na minha frente.',
    'Esgoto com mau cheiro saindo de tampa/bueiro. A situação piora em dias quentes.',
    'Lombada/Redutor irregular: muito alto e sem pintura, carros batem e pode causar acidente.',
    'Praça sem manutenção: brinquedos quebrados e perigosos para crianças.',
    'Fila e desorganização em unidade de saúde. Pessoas esperando em pé por muito tempo.',
    'Solicito reforço de ronda: ocorreram assaltos recentes no mesmo trecho à noite.',
    'Ruas muito escuras perto do ponto de ônibus. Precisa troca de lâmpadas e poda das árvores.',
    'Obstrução na via por material de obra sem sinalização. Quase bati no retorno.',
    'Coleta de lixo irregular: em alguns dias não passa e as sacolas ficam na rua.',
    'Placa de sinalização caída no chão. Motoristas ficam sem referência e há risco no cruzamento.',
    'Solicito melhoria no atendimento de uma escola pública: falta comunicação e estrutura básica no local.'
  ];

  st text;
  cat text;
  ur text;

  created_ts timestamptz;
  updated_ts timestamptz;

  max_stage int;
  s int;
  note_text text;

  creator_id uuid;
BEGIN
  -- IDs dos usuários (ajuste emails se necessário)
    SELECT id INTO joao_id   FROM users WHERE email = 'joao@softkit.local';
    SELECT id INTO maria_id  FROM users WHERE email = 'maria@softkit.local';
    SELECT id INTO ana_id    FROM users WHERE email = 'ana.lima@softkit.local';
    SELECT id INTO carlos_id FROM users WHERE email = 'carlos.oliveira@softkit.local';

IF joao_id IS NULL THEN
    RAISE EXCEPTION 'User Joao (joao@softkit.local) not found.';
END IF;
  IF maria_id IS NULL THEN
    RAISE EXCEPTION 'User Maria (maria@softkit.local) not found.';
END IF;
  IF ana_id IS NULL THEN
    RAISE EXCEPTION 'User Ana (ana.lima@softkit.local) not found.';
END IF;
  IF carlos_id IS NULL THEN
    RAISE EXCEPTION 'User Carlos (carlos.oliveira@softkit.local) not found.';
END IF;

FOR i IN 1..30 LOOP
    -- Se não tiver pgcrypto, troque por uuid_generate_v4() (uuid-ossp)
    case_id := gen_random_uuid();

    proto := 'DF-2026-' || lpad(nextval('ombudsman_protocol_seq')::text, 6, '0');

    -- variedade
    cat := cats[ ((i - 1) % array_length(cats, 1)) + 1 ];
    ur  := urg[  ((i - 1) % array_length(urg, 1)) + 1 ];
    st  := statuses[ ((i - 1) % 6) + 1 ];

    -- criador variado entre Maria/Ana/Carlos
    creator_id :=
      CASE (i % 3)
        WHEN 1 THEN maria_id
        WHEN 2 THEN ana_id
        ELSE carlos_id
END;

    created_ts := CURRENT_TIMESTAMP(3) - make_interval(hours => (i * 4));
    updated_ts := created_ts + make_interval(mins => (10 + (i % 40)));

INSERT INTO ombudsman (
    id,
    protocol_number,
    category,
    description,
    urgency,
    current_status,
    anonymous,
    privacy_consent,
    destination_agency_id,
    reporter_identity_id,

    iza_suggested_category,
    iza_suggested_agency_id,
    iza_confidence,
    iza_rationale,

    longitude,
    latitude,
    approx_address,

    created_at,
    updated_at
)
VALUES (
    case_id,
    proto,
    cat,
    descs[i],
    ur,
    st,
    (i % 8 = 0),   -- alguns anônimos
    TRUE,
    NULL,
    creator_id,

    -- IZA somente em alguns (variedade)
    CASE WHEN (i % 4 = 0) THEN cat ELSE NULL END,
    NULL,
    CASE WHEN (i % 4 = 0) THEN (0.7000 + ((i % 20) * 0.0100))::numeric(5,4) ELSE NULL END,
    CASE WHEN (i % 4 = 0) THEN 'Sugestão automática baseada no texto do cidadão.' ELSE NULL END,

    lons[i],
    lats[i],
    NULL,

    created_ts,
    updated_ts
);

-- status history até o status atual; Joao como agente que mudou status
max_stage :=
      CASE st
        WHEN 'RECEIVED' THEN 0
        WHEN 'TRIAGE' THEN 1
        WHEN 'FORWARDED' THEN 2
        WHEN 'IN_EXECUTION' THEN 3
        WHEN 'SCHEDULED' THEN 4
        WHEN 'COMPLETED' THEN 5
        ELSE 0
END;

FOR s IN 0..max_stage LOOP
      note_text :=
        CASE statuses[s+1]
          WHEN 'RECEIVED' THEN 'Recebido e registrado.'
          WHEN 'TRIAGE' THEN 'Triagem inicial realizada.'
          WHEN 'FORWARDED' THEN 'Encaminhado para tratamento.'
          WHEN 'IN_EXECUTION' THEN 'Em execução.'
          WHEN 'SCHEDULED' THEN 'Ação agendada.'
          WHEN 'COMPLETED' THEN 'Finalizado.'
          ELSE NULL
END;

INSERT INTO ombudsman_status_history (
    ombudsman_id, stage, status, changed_at, note, changed_by_user_id
)
VALUES (
    case_id,
    s,
    statuses[s+1],
    created_ts + make_interval(mins => (s * 30)),
    note_text,
    joao_id
);
END LOOP;

END LOOP;

END $$;