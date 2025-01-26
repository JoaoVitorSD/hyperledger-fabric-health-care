import { TextDecoder } from 'node:util';
import * as grpc from '@grpc/grpc-js';
import { connect, hash, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'node:crypto';
import { promises as fs } from 'node:fs';

export async function OpenGatewayConnection() {
    const credentials = await fs.readFile('../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/cert.pem');

    const privateKeyPem = await fs.readFile('../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/c6f1bcef080af46e2e73b47becd7ce0e3e367b53a7be85960bb2f98b4de61d8c_sk');
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    const signer = signers.newPrivateKeySigner(privateKey);

    const tlsRootCert = await fs.readFile('../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem');
    const client = new grpc.Client('localhost:7051', grpc.credentials.createSsl(tlsRootCert));

    const gateway = connect({
        identity: { mspId: 'Org1MSP', credentials },
        signer,
        hash: hash.sha256,
        client,
    });
    return gateway;
}
const decoder = new TextDecoder();
const medicalHistorys = [
    "CANCER",
    "HEART ATTACK",
    "DIABETES",
    "STROKE",
    "HIGH BLOOD PRESSURE",
    "HIGH CHOLESTEROL",
    "ASTHMA",
    "ARTHRITIS",
    "DEPRESSION",
    "OSTEOPOROSIS",
    "CHRONIC PAIN",
]

const CONTRACT_NAME = 'patient-v2';

const randomMedicalHistory = () => {
    return medicalHistorys[Math.floor(Math.random() * medicalHistorys.length)];
}

async function AddMedicalHistory(id){
    const gateway = await OpenGatewayConnection();
    const network = gateway.getNetwork('patient');
    const contract = network.getContract(CONTRACT_NAME);
    const patient = await getPatient(id);
    const initTime = new Date().getTime();
    console.log(`Adding medical history to patient ${patient.name}...`);
    const newMedicalHistory = patient.medicalHistory + ',' + randomMedicalHistory();
    console.log(`New medical history: ${newMedicalHistory}`);
    const resp = await contract.submitTransaction('updatePatient', patient.id, patient.name, patient.age, patient.address, newMedicalHistory);
    console.log('Transaction:', decoder.decode(resp));
    const endTime = new Date().getTime();
    const secsPerTransaction = (endTime - initTime) / 10;
    console.log(`\nAverage time per transaction: ${secsPerTransaction} ms\n`);
    gateway.close();
}

export async function getPatient(patientId) {
    const gateway = await OpenGatewayConnection();
    const network = gateway.getNetwork('patient');
    const contract = network.getContract(CONTRACT_NAME);

    const patient = await contract.evaluateTransaction('getPatient', patientId);
    gateway.close();
    return JSON.parse(new TextDecoder().decode(patient));
}

// Get the id from the command line arguments
const id = process.argv[2];
if (!id) {
    console.error('Please provide a patient id as a command line argument.');
    process.exit(1);
}

AddMedicalHistory(id);
