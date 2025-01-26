# Install hyperledger fabric binaries
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
./install-fabric.sh d s b
cd fabric-samples/test-network
cp -r ./chaincode ../fabric-samples/test-network
# https://hyperledger-fabric.readthedocs.io/en/latest/install.html
## In the root directory of test-network
./network.sh up createChannel -c patient -ca
./network.sh deployCC -ccn patient-v2 -ccp ./chaincode -ccl go -c patient