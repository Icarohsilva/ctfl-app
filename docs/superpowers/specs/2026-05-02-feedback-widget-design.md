# Feedback Widget — TestPath

**Data:** 2026-05-02  
**Escopo:** Widget flutuante de feedback com 3 categorias, persistência no Supabase e notificação por e-mail

---

## 1. Botão flutuante

Componente `<FeedbackWidget />` adicionado ao `src/app/layout.tsx`, visível em todas as páginas.

**Posição:** `position: fixed`, canto inferior direito (`bottom: 24px, right: 24px`), `zIndex: 999`.  
**Aparência:** Botão redondo com ícone 💬 e label "Feedback", fundo `#1f2937`, borda `#374151`, cor do texto `#9ca3af`. Ao hover: borda `#3b82f6`, texto `#3b82f6`.  
**Exceção:** Não renderiza na rota `/simulado-final` — verificado via `usePathname()`.

---

## 2. Modal

Abre centralizado com overlay escuro (`rgba(0,0,0,0.75)`), `zIndex: 1000`. Fecha ao clicar no overlay ou no botão ✕.

### Seleção de categoria

Três cards clicáveis no topo do modal:

| Ícone | Label | Valor interno |
|-------|-------|---------------|
| 💬 | Opinião | `opiniao` |
| 🎓 | Sugerir certificação | `certificacao` |
| 🐛 | Reportar bug | `bug` |

Ao selecionar uma categoria, o formulário correspondente aparece abaixo.

### Formulário — Opinião (`opiniao`)

- **Avaliação:** 5 estrelas clicáveis (★ preenchida / ☆ vazia), obrigatório
- **Mensagem:** textarea "O que você acha do TestPath?", obrigatório, min 10 chars

### Formulário — Sugestão de certificação (`certificacao`)

- **Nome da certificação:** input text, obrigatório (ex: "CTAL-TA")
- **Organização/banca:** input text, obrigatório (ex: "ISTQB", "PMI", "IREB")
- **Por que seria útil?:** textarea, obrigatório, min 10 chars

### Formulário — Bug (`bug`)

- **Onde aconteceu:** select com opções: Dashboard, Trilha/Tópico, Simulado, Perfil, Outro — obrigatório
- **Descrição:** textarea "O que aconteceu?", obrigatório, min 10 chars
- **URL ou tela (opcional):** input text, placeholder "Ex: /capitulo/1/topico/niveis-teste"

### Botão de envio

"Enviar feedback" — desabilitado enquanto obrigatórios não preenchidos. Estado de loading durante POST. Após sucesso: exibe mensagem "✅ Feedback enviado! Obrigado." e fecha o modal após 2 segundos.

---

## 3. API Route — `POST /api/feedback`

**Arquivo:** `src/app/api/feedback/route.ts`  
**Autenticação:** Nenhuma — endpoint público. `user_id` é inferido via `supabase.auth.getUser()` server-side se disponível; caso contrário, `null`.

### Request body

```ts
{
  tipo: "opiniao" | "certificacao" | "bug";
  dados: Record<string, string | number>;
}
```

Exemplos de `dados` por tipo:

- `opiniao`: `{ avaliacao: 4, mensagem: "..." }`
- `certificacao`: `{ nome: "CTAL-TA", organizacao: "ISTQB", motivo: "..." }`
- `bug`: `{ local: "Dashboard", descricao: "...", url: "..." }`

### Fluxo

1. Validar que `tipo` é válido e `dados` é objeto não-vazio — retorna 400 se inválido
2. Inserir em `feedbacks` via Supabase anon key (RLS deve permitir INSERT anônimo)
3. Enviar e-mail via Resend para `icaro.silva@eteg.com.br`
4. Retornar `{ ok: true }` ou `{ error: "..." }` com status apropriado

### E-mail (Resend)

- **From:** `feedback@testpath.online` (ou `noreply@testpath.online` se domínio não verificado — usar `onboarding@resend.dev` como fallback)
- **To:** `icaro.silva@eteg.com.br`
- **Assunto:** `[TestPath Feedback] ${tipo} — ${new Date().toLocaleDateString("pt-BR")}`
- **Body HTML:** tabela simples com todos os campos de `dados` + `user_id` se disponível

---

## 4. Tabela Supabase — `feedbacks`

```sql
create table feedbacks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete set null,
  tipo        text not null check (tipo in ('opiniao', 'certificacao', 'bug')),
  dados       jsonb not null,
  criado_em   timestamptz not null default now()
);

-- RLS: permitir INSERT para qualquer um (anon + authenticated)
alter table feedbacks enable row level security;
create policy "feedback_insert" on feedbacks for insert with check (true);
-- Leitura apenas para service role (sem policy de select pública)
```

> **Nota:** A tabela deve ser criada manualmente no Supabase antes do deploy. O código assume que ela existe.

---

## 5. Arquivos novos/modificados

| Arquivo | Ação |
|---------|------|
| `src/components/FeedbackWidget.tsx` | Novo — botão flutuante + modal + formulários |
| `src/app/api/feedback/route.ts` | Novo — POST handler |
| `src/app/layout.tsx` | Modificado — adiciona `<FeedbackWidget />` antes de `</body>` |

---

## 6. Fora do escopo

- Painel de admin para visualizar feedbacks (consulta direta no Supabase Dashboard)
- Rate limiting (volume inicial baixo, não justifica)
- Upload de screenshot para bug reports
- Resposta automática ao usuário que enviou o feedback
