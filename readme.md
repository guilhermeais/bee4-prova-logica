# Como Rodar

A aplicação pode ser rodada tanto pelo Docker quanto localmente, caso for rodar localmente e esteja no Windows indico utilizar algum bash, como do Git.

## Comandos
**Locais:**

Lembre-se de rodar o comando `npm i` para instalar as dependencias
- `npm run test`: Roda todos arquivos de testes que contenham `.spec.js`;`
    Esses testes foram desenvolvidos totalmente com os módulos nativos do Node.
- `npm run tarefa1`: Roda a **tarefa 1**, será gerado o resultado em CSV na pasta **results**;
- `npm run tarefa2`: Roda a **tarefa 2**, será gerado o resultado em CSV na pasta **results**;
- `npm run tarefa3`: Roda a **tarefa 3**, será gerado o resultado em CSV na pasta **results**;

**Docker:**

Os mesmos comandos podem ser rodados em um container no **docker**, adicionando o préfixo `:docker` nos comandos
- `npm :dockerrun test`: Roda todos arquivos de testes que contenham `.spec.js`;`
    Esses testes foram desenvolvidos totalmente com os módulos nativos do Node.
- `npm run tarefa1:docker`: Roda a **tarefa 1**, será gerado o resultado em CSV na pasta **results**;
- `npm run tarefa2:docker`: Roda a **tarefa 2**, será gerado o resultado em CSV na pasta **results**;
- `npm run tarefa3:docker`: Roda a **tarefa 3**, será gerado o resultado em CSV na pasta **results**;