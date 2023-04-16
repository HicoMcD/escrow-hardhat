import React, {useState, useEffect} from 'react';
import { ethers } from 'ethers';
import EscrowABI from './artifacts/contracts/Escrow.sol/Escrow';
import { Polybase } from "@polybase/client";
import Escrow from './Escrow';

const provider = new ethers.providers.Web3Provider(window.ethereum);

const ViewDeployedEscrows = () => {
    const [records, setRecords] = useState();
    const [mapRecords, setMapRecords] = useState([]);


    // const contractInstance = contract.attach('0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e')
    // console.log(contractInstance)

    const db = new Polybase({
        defaultNamespace: "pk/0xeacdb8bef7017928330ea0d5950080bca7b0a6227d33dab282191214f6098a2cc1a0c62d4d3cc6200e07b69039ed696c5633af8d87fab94575beb054acdd20db/Escrow", //"pk/0xeacdb8bef7017928330ea0d5950080bca7b0a6227d33dab282191214f6098a2cc1a0c62d4d3cc6200e07b69039ed696c5633af8d87fab94575beb054acdd20db/Escrow",
      });
      const collectionReference = db.collection("AUEscrowTest");

    useEffect(() => {
        const getRecords = async() =>{
            const records = await collectionReference.get();
            setRecords(records.data)
        }
        getRecords()
        if(records) {
            displayRecords()
            // setMapRecords
        }
    }, [])

    const displayRecords = async () => {

        await records.map((record) => {
            const contract = new ethers.Contract(record.data.escrowAddress, EscrowABI.abi, provider)
            // setMapRecords(record);
            // <p>{record.data.id}</p>
            console.log(contract)
            console.log(Escrow)
            // console.log(record.data.id)
            // console.log(record.data.escrowAddress)
            // console.log(record.data.deployerAddress)
        })
    }

    return (
        <div>
            View Deployed Escrow Contracts
            <button onClick={displayRecords}>Click</button>
        </div>
    )
}

export default ViewDeployedEscrows;