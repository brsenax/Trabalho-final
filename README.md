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



## Organização da camada Services (aula 23)

O projeto separa três responsabilidades, conforme a aula:

- **Entidades (`src/entities`)**: representam os objetos do sistema, como `User` e `Chamado`.
- **Services (`mvc/services`)**: coordenam as operações e aplicam validações simples.
- **Repositories (`mvc/repositories`)**: guardam, listam e localizam os objetos em memória.

Fluxo dos chamados:

`Controller -> ChamadoService -> ChamadoRepository -> memória`

Fluxo do login:

`Controller da tela/API -> AuthService -> UsuarioRepository -> memória`

Os Services recebem os Repositories pelo construtor. Assim, não precisam conhecer a coleção usada para guardar os dados.

**Importante:** esta versão usa memória, como no exemplo da aula. Os registros são perdidos quando a aplicação é reiniciada. A conexão com MySQL não foi ligada a esta implementação.
