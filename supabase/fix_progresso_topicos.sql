-- =============================================================
-- Migração: corrigir schema de progresso_topicos
-- Execute no Supabase Dashboard → SQL Editor
--
-- Problema: a tabela existia sem as colunas certificacao_id,
-- capitulo e xp_ganho. O código as inclui no upsert, então
-- os upserts falhavam silenciosamente e o progresso nunca
-- era gravado — causando os bugs de "não consigo avançar".
-- =============================================================

-- 1. Criar a tabela se ainda não existir (caso do zero)
CREATE TABLE IF NOT EXISTS progresso_topicos (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topico_id       text        NOT NULL,
  capitulo        integer,
  certificacao_id text        NOT NULL DEFAULT 'ctfl',
  acertos         integer     NOT NULL DEFAULT 0,
  total           integer     NOT NULL DEFAULT 0,
  xp_ganho        integer     NOT NULL DEFAULT 0,
  concluido       boolean     NOT NULL DEFAULT false,
  atualizado_em   timestamptz NOT NULL DEFAULT now()
);

-- 2. Adicionar colunas faltantes (idempotente — não falha se já existirem)
ALTER TABLE progresso_topicos ADD COLUMN IF NOT EXISTS certificacao_id text NOT NULL DEFAULT 'ctfl';
ALTER TABLE progresso_topicos ADD COLUMN IF NOT EXISTS capitulo        integer;
ALTER TABLE progresso_topicos ADD COLUMN IF NOT EXISTS xp_ganho        integer NOT NULL DEFAULT 0;

-- 3. Garantir constraint UNIQUE que o upsert (onConflict) exige
--    Se já existe constraint antiga só em (user_id, topico_id), remover primeiro.
DO $$
BEGIN
  -- Remove constraint antiga sem certificacao_id (se existir)
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'progresso_topicos_user_id_topico_id_key'
      AND contype = 'u'
  ) THEN
    ALTER TABLE progresso_topicos
      DROP CONSTRAINT progresso_topicos_user_id_topico_id_key;
  END IF;

  -- Adiciona constraint nova (user_id, topico_id, certificacao_id) se não existir
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'progresso_topicos_user_id_topico_id_certificacao_id_key'
      AND contype = 'u'
  ) THEN
    ALTER TABLE progresso_topicos
      ADD CONSTRAINT progresso_topicos_user_id_topico_id_certificacao_id_key
      UNIQUE (user_id, topico_id, certificacao_id);
  END IF;
END $$;

-- 4. Ativar RLS
ALTER TABLE progresso_topicos ENABLE ROW LEVEL SECURITY;

-- 5. Policies (recrear para garantir consistência)
DROP POLICY IF EXISTS "progresso_select" ON progresso_topicos;
CREATE POLICY "progresso_select" ON progresso_topicos
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "progresso_insert" ON progresso_topicos;
CREATE POLICY "progresso_insert" ON progresso_topicos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "progresso_update" ON progresso_topicos;
CREATE POLICY "progresso_update" ON progresso_topicos
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================================
-- Criar historico_conceitos se não existir
-- (usada por TopicoGenerico para registrar acertos/erros
--  por conceito — também pode estar faltando)
-- =============================================================
CREATE TABLE IF NOT EXISTS historico_conceitos (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topico_id   text        NOT NULL,
  conceito    text        NOT NULL,
  acertou     boolean     NOT NULL,
  dificuldade text        NOT NULL,
  criado_em   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE historico_conceitos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "historico_insert" ON historico_conceitos;
CREATE POLICY "historico_insert" ON historico_conceitos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "historico_select" ON historico_conceitos;
CREATE POLICY "historico_select" ON historico_conceitos
  FOR SELECT USING (auth.uid() = user_id);
