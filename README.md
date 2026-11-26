# Integrantes: 
1. Bruno Sena
2. Davi Protásio
3. Arthur Uemoto

# Tema:
Tema 6 - Central de chamadas e manuntenção

# Divisão de cadastros (M1):

.Tabela no banco: Bruno Sena
.Classes: Arthur
.Rotas e telas: Davi

MODELO CONCEITUAL:



<img width="475" height="305" alt="image" src="https://github.com/user-attachments/assets/d7402ef0-e232-4222-b273-830245df8b85" />

DIAGRAMA DE CLASSES:


<img width="1430" height="772" alt="image" src="https://github.com/user-attachments/assets/37007703-f131-4d7a-8b68-46eb5be7997a" />

MODELO LOGICO: 

<img width="962" height="631" alt="image" src="https://github.com/user-attachments/assets/e4362c7c-2a33-43ee-9877-c83cdc417802" />



## Arquitetura

O projeto foi reorganizado em duas partes independentes: **server** (API Express em camadas) e **web** (telas que só consomem a API).

```
server/
  entities/       objetos do domínio (User, Chamado, ...) e suas regras próprias
  repositories/   guardam e buscam entidades (interface + implementação em memória)
  services/       regras de negócio e validações; recebem repositories pelo construtor
  controllers/    leem a requisição HTTP e chamam o service
  routes/         ligam URL -> controller
  middlewares/    autenticação (JWT), checagem de perfil admin e tradução de erros em status HTTP
  app.ts          raiz de composição: decide qual repository cada service recebe
  server.ts       sobe o servidor
web/
  clients/        único lugar que faz fetch para /api
  views/          só desenham HTML e capturam eventos (não guardam dados)
  main.ts         escolhe entre login e painel
```

Fluxo de uma requisição:

`Route -> Controller -> Service -> Repository (interface) -> memória`

Regra de ouro: **a web nunca importa repository, service nem entity do servidor.** Todo dado de chamado nasce e é guardado no back; o navegador guarda apenas o token de login.

Para trocar a memória por MySQL, crie `ChamadoRepositoryMysql implements ChamadoRepository` e troque a linha correspondente em `server/app.ts`. Services e controllers não mudam.

## Como rodar

```
npm install
npm run server   # API em http://localhost:3000
npm start        # front em http://localhost:5173 (o Vite repassa /api para a porta 3000)
npm run check    # typecheck do server e do web
```

Usuários de teste (senha `123`): `admin@ifal.edu.br` (administrador) e `aluno@ifal.edu.br` (usuário comum).
Defina `JWT_SECRET` no ambiente em produção.

## Perfis de usuário

| Perfil | Entra em | Telas |
|---|---|---|
| `usuario` | Visão geral | Visão geral, Meus chamados, Abrir chamado, Relatórios (sempre só com os próprios chamados) |
| `admin` | Dashboard | Dashboard (todos os chamados, com solicitante e status) e Usuários |

O perfil fica na entity `User` e é conferido no **servidor** a cada requisição (o front só escolhe qual menu mostrar). Um usuário comum que chame as rotas de administrador recebe `403`.

A tela **Usuários** é um placeholder: o CRUD será feito depois da integração com o banco de dados.

## Endpoints

| Método | Rota | Quem acessa | Descrição |
|---|---|---|---|
| POST | `/api/usuarios/login` | todos | devolve `token` + `usuario` (com `perfil`) |
| POST | `/api/usuarios/recuperar-senha` | todos | redefine a senha |
| GET | `/api/chamados/meus` | logado | chamados do usuário logado |
| GET | `/api/chamados/meus/resumo` | logado | totais dos chamados do usuário logado |
| POST | `/api/chamados` | logado | cria chamado (`descricao`, `setor`, `prioridade?`) |
| GET | `/api/chamados` | **admin** | todos os chamados, com `solicitante` |
| GET | `/api/chamados/resumo` | **admin** | totais gerais por status e prioridade |

**Importante:** os dados ainda ficam em memória no servidor: sobrevivem a recarregar a página, mas são perdidos ao reiniciar o servidor.
