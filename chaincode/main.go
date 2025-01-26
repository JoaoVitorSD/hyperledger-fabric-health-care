package main

import (
    "encoding/json"
    "fmt"
    "time"
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type PatientChaincode struct {
    contractapi.Contract
}

type Patient struct {
    ID            string   `json:"id"`
    Name          string   `json:"name"`
    Age           string   `json:"age"`
    Address       string   `json:"address"`
    MedicalHistory string `json:"medicalHistory"`
    CreatedAt     string   `json:"createdAt"`
    UpdatedAt     string   `json:"updatedAt"`
}

func (pc *PatientChaincode) InitLedger(ctx contractapi.TransactionContextInterface) error {
    patients := []Patient{
        {
            ID:            "e29d4f50-e56a-4678-bade-6c3bd3871928",
            Name:          "John Doe",
            Age:           "35",
            Address:       "123 Health St",
            MedicalHistory: "Diabetes",
            CreatedAt:     time.Now().Format(time.RFC3339),
            UpdatedAt:     time.Now().Format(time.RFC3339),
        },
    }

    for _, patient := range patients {
        patientJSON, err := json.Marshal(patient)
        if err != nil {
            return err
        }

        err = ctx.GetStub().PutState(patient.ID, patientJSON)
        if err != nil {
            return err
        }
    }

    return nil
}

func (pc *PatientChaincode) CreatePatient(ctx contractapi.TransactionContextInterface, id string,name string, age string, address string, medicalHistory string) (*Patient, error) {
    patient := Patient{
        ID:            id,
        Name:          name,
        Age:           age,
        Address:       address,
        MedicalHistory: medicalHistory,
        CreatedAt:     time.Now().Format(time.RFC3339),
        UpdatedAt:     time.Now().Format(time.RFC3339),
    }

    patientJSON, err := json.Marshal(patient)
    if err != nil {
        return nil, err
    }

    err = ctx.GetStub().PutState(id, patientJSON)
    if err != nil {
        return nil, err
    }

    return &patient, nil
}

func (pc *PatientChaincode) GetPatient(ctx contractapi.TransactionContextInterface, patientId string) (*Patient, error) {
    patientJSON, err := ctx.GetStub().GetState(patientId)
    if err != nil {
        return nil, err
    }
    if patientJSON == nil {
        return nil, fmt.Errorf("Patient %s does not exist", patientId)
    }

    var patient Patient
    err = json.Unmarshal(patientJSON, &patient)
    if err != nil {
        return nil, err
    }

    return &patient, nil
}

func (pc *PatientChaincode) UpdatePatient(ctx contractapi.TransactionContextInterface, patientId, name, age, address string, medicalHistory string) (*Patient, error) {
    patientJSON, err := ctx.GetStub().GetState(patientId)
    if err != nil {
        return nil, err
    }
    if patientJSON == nil {
        return nil, fmt.Errorf("Patient %s does not exist", patientId)
    }

    var patient Patient
    err = json.Unmarshal(patientJSON, &patient)
    if err != nil {
        return nil, err
    }

    if name != "" {
        patient.Name = name
    }
    if age != "" {
        patient.Age = age
    }
    if address != "" {
        patient.Address = address
    }
    if medicalHistory != "" {
        patient.MedicalHistory = medicalHistory
    }
    patient.UpdatedAt = time.Now().Format(time.RFC3339)

    updatedPatientJSON, err := json.Marshal(patient)
    if err != nil {
        return nil, err
    }

    err = ctx.GetStub().PutState(patientId, updatedPatientJSON)
    if err != nil {
        return nil, err
    }

    return &patient, nil
}

func (pc *PatientChaincode) DeletePatient(ctx contractapi.TransactionContextInterface, patientId string) error {
    exists, err := pc.PatientExists(ctx, patientId)
    if err != nil {
        return err
    }
    if !exists {
        return fmt.Errorf("Patient %s does not exist", patientId)
    }

    return ctx.GetStub().DelState(patientId)
}

func (pc *PatientChaincode) PatientExists(ctx contractapi.TransactionContextInterface, patientId string) (bool, error) {
    patientJSON, err := ctx.GetStub().GetState(patientId)
    if err != nil {
        return false, err
    }

    return patientJSON != nil, nil
}
func (pc *PatientChaincode) GetAllPatients(ctx contractapi.TransactionContextInterface) ([]*Patient, error) {
    resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
    if err != nil {
        return nil, err
    }
    defer resultsIterator.Close()

    var patients []*Patient
    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return nil, err
        }

        var patient Patient
        err = json.Unmarshal(queryResponse.Value, &patient)
        if err != nil {
            return nil, err
        }
        patients = append(patients, &patient)
    }

    return patients, nil
}

func main() {
    chaincode, err := contractapi.NewChaincode(new(PatientChaincode))
    if err != nil {
        fmt.Printf("Error create patient-chaincode: %s", err.Error())
        return
    }

    if err := chaincode.Start(); err != nil {
        fmt.Printf("Error starting patient-chaincode: %s", err.Error())
    }
}