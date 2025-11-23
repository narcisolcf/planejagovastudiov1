# ⚡ Setup Rápido - 10 Minutos

Guia ultra-simplificado para configurar o Supabase.

---

## 📝 CHECKLIST

- [ ] **Passo 1:** Criar conta no Supabase (2 min)
- [ ] **Passo 2:** Copiar credenciais (1 min)
- [ ] **Passo 3:** Executar SQL único (2 min)
- [ ] **Passo 4:** Criar 4 buckets (3 min)
- [ ] **Passo 5:** Criar usuário admin (2 min)
- [ ] **Passo 6:** Testar aplicação (1 min)

---

## 1️⃣ CRIAR CONTA NO SUPABASE

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub ou Email
4. Clique em **"New Project"**
5. Preencha:
   - **Nome:** `planejagov-sgem`
   - **Database Password:** `[ANOTE SENHA FORTE]`
   - **Region:** `South America (sao-paulo)`
6. Clique **"Create new project"**
7. Aguarde 2 minutos ⏳

---

## 2️⃣ COPIAR CREDENCIAIS

1. Clique no ícone **⚙️ Settings** (canto inferior esquerdo)
2. Clique em **API**
3. Copie:
   - **Project URL:** `https://xxxxxxx.supabase.co`
   - **anon public key:** `eyJhbGci...` (chave longa)

**No terminal:**
```bash
# Criar arquivo .env.local
cp .env.example .env.local

# Editar (use nano, vim ou code)
nano .env.local
```

**Cole suas credenciais:**
```env
VITE_SUPABASE_URL=https://xxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

Salve (Ctrl+O, Enter, Ctrl+X)

---

## 3️⃣ EXECUTAR SQL ÚNICO

**No Supabase Dashboard:**

1. Clique no ícone **`</>`** (SQL Editor) no menu lateral
2. Clique em **"+ New Query"**
3. **Abra o arquivo:** `supabase/setup_completo.sql`
4. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
5. **Cole no SQL Editor** (Ctrl+V)
6. Clique em **▶️ RUN**
7. Aguarde ~30 segundos ⏳
8. ✅ Deve aparecer: **"Success"** + mensagem verde

**Verificar:**
- Clique em **Table Editor** (menu lateral)
- Deve aparecer **14 tabelas**

---

## 4️⃣ CRIAR 4 BUCKETS

**No Supabase Dashboard:**

1. Clique no ícone **📁 Storage** (menu lateral)

**Bucket 1:**
- Clique **"Create a new bucket"**
- Nome: `documents`
- Public: **✅ SIM**
- Clique **"Create"**

**Bucket 2:**
- Clique **"Create a new bucket"**
- Nome: `evidence`
- Public: **❌ NÃO**
- Clique **"Create"**

**Bucket 3:**
- Clique **"Create a new bucket"**
- Nome: `avatars`
- Public: **✅ SIM**
- Clique **"Create"**

**Bucket 4:**
- Clique **"Create a new bucket"**
- Nome: `exports`
- Public: **❌ NÃO**
- Clique **"Create"**

✅ **Verificar:** Deve ter 4 buckets agora.

---

## 5️⃣ CRIAR USUÁRIO ADMIN

**No Supabase Dashboard:**

1. Clique no ícone **👤 Authentication** (menu lateral)
2. Clique **"Add user"** > **"Create new user"**
3. Preencha:
   - Email: `admin@exemplo.com.br`
   - Password: `Admin@123456`
   - Auto Confirm User: **✅ SIM**
4. Clique **"Create user"**
5. **COPIE O ID** do usuário (aparece na tabela)

**Criar perfil (volte ao SQL Editor):**

1. Clique **"+ New Query"**
2. Cole (substitua `SEU_USER_ID_AQUI`):

```sql
INSERT INTO profiles (id, organization_id, name, role)
VALUES (
  'SEU_USER_ID_AQUI',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Administrador',
  'ADMIN'
);
```

3. Clique **▶️ RUN**

---

## 6️⃣ TESTAR APLICAÇÃO

**No terminal:**

```bash
# Rodar aplicação
npm run dev
```

**No navegador:**

1. Acesse: http://localhost:3000
2. Faça login:
   - Email: `admin@exemplo.com.br`
   - Senha: `Admin@123456`
3. ✅ Deve entrar no Dashboard!

**Testar upload:**

1. Vá em **"Gestão Orçamentária"**
2. Clique **"Upload da Lei (PDF)"** (em PPA, LDO ou LOA)
3. Selecione qualquer PDF
4. ✅ Deve aparecer mensagem verde!

---

## 🎉 PRONTO!

Se tudo funcionou, você tem:
- ✅ Supabase configurado
- ✅ 14 tabelas no banco
- ✅ 4 buckets de storage
- ✅ Usuário admin criado
- ✅ Upload funcionando

---

## 🆘 PROBLEMAS?

### Erro: "Invalid API key"
```bash
# Verificar .env.local
cat .env.local
# Certifique-se que copiou a chave "anon", não "service_role"
```

### Erro: "Bucket not found"
- Volte ao Storage e crie os 4 buckets

### Erro: "Row Level Security"
- Execute novamente o `setup_completo.sql`

### Upload não funciona
- Abra o console do navegador (F12)
- Veja erros em vermelho
- Verifique se está logado

---

## 📞 PRECISA DE AJUDA?

Me avise qual passo está travado e eu te ajudo!
