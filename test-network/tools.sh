## Setup
./network.sh up createChannel -c patient -ca
./network.sh deployCC -ccn patient-v2 -ccp ./chaincode -ccl go -c patient

./network.sh down

rm -rf organizations/peerOrganizations
rm -rf organizations/ordererOrganizations
rm -rf channel-artifacts
rm -rf system-genesis-block
docker ps -aq | xargs -r docker rm -f
docker volume ls -q | xargs -r docker volume rm