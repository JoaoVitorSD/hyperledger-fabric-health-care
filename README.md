# Hyperledger Fabric Health Care Data Management

## Composição
| Equipe                     | Tipo do Projeto            |
|----------------------------| --------------------------- |
| João Vítor Santana Depollo | Desenvolvimento de Software|

## Abstract
O projeto visa a criação de um sistema de gerenciamento de dados de saúde 
utilizando o Hyperledger Fabric, armazenando dados de patientes, exames e etç.

## Descrição

O projeto será desenvolvido com o [Hyperledger Fabric](https://www.hyperledger.org/use/fabric)
O sistema será composto por uma rede blockchain privada, onde os dados serão armazenados de forma segura e imutável. Na arquitetura que será desenvolvida, serão consideradas 2 organizações
interessadas no sistema:
- Hospital
- Laboratório de Exames

Neste modelo, o hospital utilizara do smart contract(chaincode) dos patientes e o laboratório de exames utilizara do smart contract dos exames. Ambos os contratos serão responsáveis por armazenar os dados de seus respectivos patientes e exames, e também por realizar a comunicação entre si, quando necessário.

## Resultados Esperados
- Desenvolvimento de um sistema confiável e seguro para armazenamento de dados de saúde
- Validar se utilizar blockchain em sistemas que contém regras de negócio complexas é uma prática sustentável
- Desenvolvimento dos peers de cada organização
- Discutir a real necessidade de utilizar blockchain em sistemas de saúde
- Arquitetura:
  ![Arquitetura](img/arq.png)


## Métodos Utilizados
- Realizar testes de stress na rede
- Realizar testes de segurança
- Avaliar a arquitetura alcançada

### Tecnologias Utilizadas
- Hyperledger Fabric
- Go (Chaincode)
- Docker (Containers)
- Node.js (API)


```sh
# Install hyperledger fabric binaries
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
./install-fabric.sh d s b
cd fabric-samples/test-network
cp -r ./chaincode ../fabric-samples/test-network
# https://hyperledger-fabric.readthedocs.io/en/latest/install.html
## In the root directory of test-network
./network.sh up createChannel -c patient -ca
./network.sh deployCC -ccn patient-v2 -ccp ./chaincode -ccl go -c patient
```