---
authors:
  - Sayymon
categories:
  - general
description:
  Cria a estrutura de contexto inteligente do AmazonQ para projetos de
  forma padronizada , conforme documentação da aws.
draft: false
howToUse: "💡 Exemplos de Uso


  ```

  @amazonq-config-rules-project Configure contexto inteligente do AmazonQ no meu projeto

  ```"
images: []
tags:
  - Documentation
  - Design
  - Plan
  - Dev Agent
title: Configuração de Contexto Inteligente AmazonQ
createdAt: 2025-09-16T00:23:29.795Z
updatedAt: 2025-09-16T00:23:29.795Z
aliases:
  ["/prompts/prompt/configura-o-de-contexto-inteligente-amazonq-fc4a1530"]
---

## Objetivo

Crie estrutura completa de contexto inteligente do AmazonQ para projetos, conforme estrutura Base :

```
.amazonq/
└── rules/
    ├── project-overview.md
    ├── coding-standards.md
    ├── architecture-patterns.md
    ├── business-rules.md
    ├── scenarios.md
```

## Análise Prévia

Antes de criar as regras, analise:

- **Código existente**: Padrões, arquitetura, tecnologias
- **Documentação**: README, ADRs, design docs
- **Configurações**: package.json, pom.xml, requirements.txt
- **Testes**: Estrutura e padrões de teste
- **Integrações**: APIs, bancos, serviços externos

## Regras Detalhadas

### 1. project-overview.md

**Conteúdo essencial:**

- Propósito e objetivos do projeto
- Stack tecnológico completo
- Arquitetura de alto nível
- Principais funcionalidades
- Dependências e bibliotecas
- Configuração de desenvolvimento
- Comandos essenciais (build, test, deploy)
- APIs internas e externas utilizadas
- Formato de requests/responses
- Autenticação e autorização
- Rate limits e retry policies
- Mapeamento de erros e fallbacks
- Configurações de timeout
- Monitoramento e health checks

### 2. coding-standards.md

**Conteúdo essencial:**

- Convenções de nomenclatura (classes, métodos, variáveis)
- Estrutura de diretórios e organização de código
- Padrões de formatação e linting
- Convenções de commit e branching
- Padrões de documentação inline
- Tratamento de erros e logging
- Validações e sanitização de dados

### 3. architecture-patterns.md

**Conteúdo essencial:**

- Padrões arquiteturais utilizados (MVC, Clean Architecture, Hexagonal, etc.)
- Design patterns implementados
- Estrutura de camadas e responsabilidades
- Padrões de comunicação entre componentes
- Estratégias de cache e performance
- Padrões de segurança e autenticação
- Configuração de ambientes e deployment

### 4. business-rules.md

**Conteúdo essencial:**

- Regras de negócio por domínio/módulo
- Validações específicas do negócio
- Fluxos de aprovação e workflows
- Cálculos e fórmulas de negócio
- Restrições e limitações
- Estados e transições de entidades
- Políticas de acesso e permissões

### 5. scenarios.md

**Formato BDD obrigatório:**

## Templates Específicos

### Template para Regras de Negócio

```markdown
## [Domínio/Módulo]

### Regras Principais

- **RN001**: [Descrição da regra]
  - Condição: [quando aplicar]
  - Ação: [o que fazer]
  - Exceções: [casos especiais]

### Validações

- Campo X deve [critério]
- Status Y só pode [transições permitidas]

### Cálculos

- Fórmula Z: [expressão matemática]
- Considerações: [casos especiais]
```

## Diretrizes de Implementação

### Análise de Código

1. Identifique padrões existentes antes de documentar
2. Extraia regras implícitas do código
3. Documente exceções e casos especiais
4. Mantenha consistência com implementação atual

### Cenários BDD

1. Foque nos fluxos principais de cada feature
2. Inclua cenários de erro e validação
3. Use linguagem de negócio, não técnica
4. Mantenha cenários independentes e testáveis

### Regras de Negócio

1. Organize por domínio/contexto
2. Use numeração para referência (RN001, RN002)
3. Inclua exemplos práticos
4. Documente exceções e casos especiais

### Integrações

1. Documente contratos de API
2. Inclua exemplos de payload
3. Mapeie códigos de erro
4. Defina estratégias de fallback

## Validação e Manutenção

- Mantenha sincronizado com código
- Atualize conforme evolução do projeto
- Use como referência para novos desenvolvimentos
- Integre com processo de code review
