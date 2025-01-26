import * as grpc from '@grpc/grpc-js';
import { connect, hash, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import { TextDecoder } from 'node:util';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

const CONTRACT_NAME ='patient-v2';
const decoder = new TextDecoder();
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


function randomPatient (){
    return {
        id: uuidv4(),
        name: faker.person.fullName(0),
        age: faker.number.int({ min: 0, max: 100 }).toString(),
        address: faker.location.streetAddress(),
        medicalHistory: [faker.lorem.sentence(), faker.lorem.sentence()]
    };
}

async function createPatient() {
    const gateway = await OpenGatewayConnection();
    const network = gateway.getNetwork('patient');
    const contract = network.getContract(CONTRACT_NAME);
    const initTime = new Date().getTime();
        const patient = randomPatient();
        const resp = await contract.submitTransaction('createPatient',patient.id, patient.name, patient.age, patient.address, "");
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
    console.log('Patient:', new TextDecoder().decode(patient));
    gateway.close();
    return JSON.parse(new TextDecoder().decode(patient));
}

async function TestGetPatientTime(){
    const initTime = new Date().getTime();
    const users = ["0370ce91-2139-4069-8ce9-5bb71825958a", "3f242915-3e6e-41f4-8300-5bc0200183a7", "16717a65-9db1-4eca-a30a-fe3897ebf72c", "3764bf4a-d396-4349-99e8-e3f5eb25aa75"]
    for (let i = 0; i < 10; i++) {
       await getPatient(users[i % 4]);
    }
    const endTime = new Date().getTime();
    const secsPerTransaction = (endTime - initTime) / 10;
    console.log(`\nAverage time per transaction: ${secsPerTransaction} ms\n`);

}
// TestGetPatientTime();
async function GetAllPatients() {
    const init = new Date().getTime();
    const gateway = await OpenGatewayConnection();
    const network = gateway.getNetwork('patient');
    const contract = network.getContract(CONTRACT_NAME);

    const result = await contract.evaluateTransaction('GetAllPatients');
    console.log('Result:', new TextDecoder().decode(result));
    gateway.close();

    const end = new Date().getTime();
    const secsPerTransaction = (end - init) / 10;
    console.log(`\nAverage time per transaction: ${secsPerTransaction} ms\n`);

}
// GetAllPatients();