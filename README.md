# Hyperledger Fabric Health Care Data Management

## Composição
| Equipe                     | Tipo do Projeto            |
|----------------------------| --------------------------- |
| João Vítor Santana Depollo | Desenvolvimento de Software|

## Abstract
O projeto visa a criação de um sistema de gerenciamento de dados de saúde 
utilizando o Hyperledger Fabric, armazenando dados de pacientes, exames e etç.

## Descrição

O projeto será desenvolvimento com o [Hyperledger Fabric](https://www.hyperledger.org/use/fabric)
O sistema será composto por uma rede blockchain privada, onde os dados serão armazenados de forma segura e imutável. Na arquitetura que será desenvolvida, serão consideradas 2 organizações
interessadas no sistema:
- Hospital
- Laboratório de Exames

Neste modelo, o hospital utilizara do smart contract(chaincode) dos pacientes e o laboratório de exames utilizara do smart contract dos exames. Ambos os contratos serão responsáveis por armazenar os dados de seus respectivos pacientes e exames, e também por realizar a comunicação entre si, quando necessário.

## Resultados Esperados
- Desenvolvimento de um sistema confiável e seguro para armazenamento de dados de saúde
- Validar se utilizar blockchain em sistemas que contém regras de negócio complexas é uma prática sustentável


## Métodos Utilizados
- Realizar testes de stress na rede
- Realizar testes de segurança
- Avaliar a arquitetura alcançada

### Tecnologias Utilizadas
- Hyperledger Fabric
- Go (Chaincode & API)
- Docker (Containers)
- React.js (Frontend)
