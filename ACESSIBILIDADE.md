# Guia de Acessibilidade - PlanejaGov

Este documento descreve as práticas de acessibilidade implementadas no PlanejaGov, seguindo as diretrizes WCAG 2.1 Nível AA.

## 🎯 Princípios WCAG

1. **Perceptível** - Informação e componentes da interface devem ser apresentados de forma que os usuários possam perceber
2. **Operável** - Componentes da interface e navegação devem ser operáveis
3. **Compreensível** - Informação e operação da interface devem ser compreensíveis
4. **Robusto** - Conteúdo deve ser robusto o suficiente para ser interpretado por diversos user agents, incluindo tecnologias assistivas

---

## ✅ Checklist de Implementação

### Navegação por Teclado

- [x] **Tab** navega por todos os elementos interativos em ordem lógica
- [x] **Enter/Space** ativa botões, links e controles
- [x] **Escape** fecha modais e dropdowns
- [x] **Setas** navegam em menus e listas (onde aplicável)
- [ ] Skip links implementados para pular para conteúdo principal
- [x] Foco visível em todos os elementos interativos (ring-2)
- [x] Nenhuma armadilha de teclado (focus traps adequados em modais)

### Leitores de Tela (Screen Readers)

- [x] Todos os inputs têm `<label>` associado via `htmlFor`/`id`
- [x] Imagens decorativas têm `alt=""` ou `aria-hidden="true"`
- [x] Imagens informativas têm `alt` descritivo
- [x] Botões têm `aria-label` quando o texto não é descritivo
- [x] Regiões ARIA definidas: `navigation`, `main`, `complementary`
- [x] Estados dinâmicos anunciados com `aria-live`
- [x] `aria-expanded` em elementos expansíveis (dropdowns, menus)
- [x] `aria-haspopup` em elementos com submenus
- [x] `aria-invalid` em campos com erro
- [x] `role="alert"` para mensagens de erro

### Contraste e Visual

- [x] Contraste mínimo 4.5:1 para texto normal
- [x] Contraste mínimo 3:1 para texto grande (18pt+)
- [x] Contraste mínimo 3:1 para componentes de interface
- [x] Foco visível com contraste adequado
- [ ] Sem dependência apenas de cor para transmitir informação
- [x] Textos redimensionáveis até 200% sem perda de funcionalidade
- [x] Sem rolagem horizontal em zoom de 400%

### Formulários

- [x] Labels visíveis e programaticamente associados
- [x] Campos obrigatórios indicados visualmente e via `required`/`aria-required`
- [x] Mensagens de erro claras e específicas
- [x] Erros associados aos campos via `aria-describedby`
- [x] Validação em tempo real onde apropriado
- [x] Instruções claras antes do preenchimento
- [x] Autocomplete apropriado (`autoComplete` attribute)

### Semântica HTML

- [x] HTML semântico usado apropriadamente (`nav`, `main`, `article`, `section`)
- [x] Hierarquia de headings lógica (h1 → h2 → h3)
- [x] Listas usadas para conteúdo em lista (`ul`, `ol`, `li`)
- [x] Landmarks ARIA quando HTML semântico não é suficiente
- [x] Tabelas usadas apenas para dados tabulares

### Interatividade

- [x] Alvos de toque/clique com pelo menos 44x44px
- [x] Espaçamento adequado entre elementos interativos
- [x] Feedback visual para todas as interações
- [x] Loading states anunciados para operações assíncronas
- [x] Timeouts podem ser desabilitados/estendidos pelo usuário

---

## 🛠️ Componentes Acessíveis

### FormField - Campo de Formulário Acessível

```tsx
<FormField
  id="nome"
  label="Nome completo"
  type="text"
  value={nome}
  onChange={setNome}
  required
  error={erros.nome}
  placeholder="Digite seu nome"
/>
```

**Características:**
- Label programaticamente associado
- Estado de erro anunciado via `aria-invalid` e `aria-describedby`
- Campo obrigatório indicado visualmente (*) e via `aria-required`
- Mensagens de erro com `role="alert"` e `aria-live="polite"`

### Button - Botão Acessível

```tsx
<Button
  onClick={handleClick}
  disabled={loading}
  ariaLabel="Salvar plano"
  variant="primary"
>
  {loading ? 'Salvando...' : 'Salvar'}
</Button>
```

**Características:**
- Estado desabilitado gerenciado corretamente
- Loading state anunciado via mudança de texto
- Foco visível e clicável por teclado
- aria-label para contexto adicional

### Modal - Modal Acessível

```tsx
<Modal
  isOpen={modalAberto}
  onClose={fecharModal}
  title="Confirmar exclusão"
>
  {/* Conteúdo */}
</Modal>
```

**Características:**
- Focus trap: foco fica dentro do modal
- Escape fecha o modal
- Primeiro elemento focável recebe foco ao abrir
- Foco retorna ao elemento que abriu ao fechar
- `role="dialog"` e `aria-modal="true"`
- `aria-labelledby` aponta para o título

---

## 🧪 Testes de Acessibilidade

### Testes Automáticos

```bash
# Instalar ferramentas
npm install --save-dev @axe-core/react eslint-plugin-jsx-a11y

# Executar testes
npm run test:a11y
```

### Testes Manuais

#### Com Teclado
1. Navegue pela aplicação usando apenas Tab/Shift+Tab
2. Ative controles com Enter/Space
3. Feche modais com Escape
4. Verifique se o foco é sempre visível

#### Com Leitor de Tela
1. **NVDA** (Windows - gratuito)
   - Baixe em: https://www.nvaccess.org/download/
   - Ctrl para pausar/retomar fala

2. **JAWS** (Windows - pago)
   - Demo gratuita disponível

3. **VoiceOver** (Mac - nativo)
   - Cmd+F5 para ativar
   - Ctrl para pausar/retomar fala

4. **TalkBack** (Android - nativo)

**O que testar:**
- Todos os textos são lidos corretamente?
- Labels dos campos são anunciados?
- Erros de validação são anunciados?
- Estados de loading são anunciados?
- Estrutura da página faz sentido?

#### Com Zoom
1. Aumentar zoom para 200%
2. Verificar se todo o conteúdo é acessível
3. Não deve haver rolagem horizontal
4. Textos devem continuar legíveis

---

## 📚 Recursos Adicionais

### Ferramentas
- [WAVE](https://wave.webaim.org/) - Avaliação visual de acessibilidade
- [axe DevTools](https://www.deque.com/axe/devtools/) - Extensão para Chrome/Firefox
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Auditoria de acessibilidade

### Documentação
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Guia rápido
- [MDN - Acessibilidade](https://developer.mozilla.org/pt-BR/docs/Web/Accessibility)
- [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/) - Padrões de ARIA

### Comunidade
- [WebAIM](https://webaim.org/) - Recursos e artigos
- [A11y Project](https://www.a11yproject.com/) - Checklist e recursos

---

## 🔄 Processo de Revisão

1. **Desenvolvimento**: Seguir checklist durante implementação
2. **Code Review**: Verificar acessibilidade em PRs
3. **Testes Automáticos**: Executar antes de merge
4. **Testes Manuais**: Teste com teclado e leitor de tela
5. **Auditoria**: Revisão completa a cada release

---

## 📞 Reportar Problemas

Se você encontrar problemas de acessibilidade:

1. Abra uma issue no GitHub: [Novo Issue](https://github.com/narcisolcf/planejagovastudiov1/issues/new)
2. Use o label `acessibilidade`
3. Descreva:
   - O que você esperava
   - O que aconteceu
   - Ferramenta/método usado
   - Screenshots (se aplicável)

---

## ✨ Compromisso

O PlanejaGov se compromete a fornecer uma experiência acessível para todos os usuários, independentemente de suas habilidades ou tecnologias assistivas utilizadas.

Última atualização: 22/11/2025
