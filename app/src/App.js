import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
// import ViewDeployedEscrows from './ViewDeployedEscrows';
import { Polybase } from "@polybase/client";
// import axios from 'axios';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  const tx = await approveTxn.wait();
  console.log(tx);
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  const [records, setRecords] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());

    }

    getAccounts();
  }, [account]);


  useEffect(() => {

    const db = new Polybase({
      defaultNamespace: "pk/0xeacdb8bef7017928330ea0d5950080bca7b0a6227d33dab282191214f6098a2cc1a0c62d4d3cc6200e07b69039ed696c5633af8d87fab94575beb054acdd20db/Escrow", //"pk/0xeacdb8bef7017928330ea0d5950080bca7b0a6227d33dab282191214f6098a2cc1a0c62d4d3cc6200e07b69039ed696c5633af8d87fab94575beb054acdd20db/Escrow",
    });
    const collectionReference = db.collection("AUEscrowTest");

    const getRecords = async() =>{
        const records = await collectionReference.get();
        setRecords(records.data)
        console.log(records.data)
      }
      getRecords();

    }, []);

    // if(records) {
      // console.log(records[0].data.deployerAddress);
      const getRecords = () => {
        
      records.map((record) => {
        // console.log(record.data);

        const escrow = {
          address: record.data.escrowAddress,
          arbiter: record.data.arbiter,
          beneficiary: record.data.beneficiary,
          value: record.data.value,
          id: record.data.id,
          //handleApprove
        }
        setEscrows([...escrows, escrow]);
        // console.log(escrow);

      })
    }

    // }

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    // const valueBN = ethers.BigNumber.from(document.getElementById('wei').value);
    const value = ethers.utils.parseEther(document.getElementById('ether').value)
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address, //escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };
    // console.log(escrow)

    const db = new Polybase({
      defaultNamespace: "pk/0xeacdb8bef7017928330ea0d5950080bca7b0a6227d33dab282191214f6098a2cc1a0c62d4d3cc6200e07b69039ed696c5633af8d87fab94575beb054acdd20db/Escrow", //"pk/0xeacdb8bef7017928330ea0d5950080bca7b0a6227d33dab282191214f6098a2cc1a0c62d4d3cc6200e07b69039ed696c5633af8d87fab94575beb054acdd20db/Escrow",
    });
    const collectionReference = db.collection("AUEscrowTest");

    const records = await collectionReference.get();
    // console.log(records.data.length);
    const recordsLength = records.data.length;
    const lastRecord = records.data[recordsLength - 1]
    // console.log(lastRecord)
    // const lastRecordID = Number(lastRecord.data.id)
    const newRecord = recordsLength + 1;
    const newRecordID = String(newRecord);

    const recordData = await collectionReference.create([
      newRecordID,
      account.toString(),
      escrowContract.address.toString(),
      arbiter,
      beneficiary,
      document.getElementById('ether').value,
      ])

    console.log(recordData);
    console.log(escrowContract.address)
    // setEscrows([...escrows, escrow]);
  }


  return (
    <>
    <h1>Escrow Contract</h1>
    <div className='wrapper'>
      <div className="contract">
        <h2> Deploy New Escrow Contract </h2>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Ether)
          <input type="text" id="ether" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>

      </div>

      <div className="existing-contracts">
        <h2> Existing Contracts </h2>
        {/* <ViewDeployedEscrows /> */}
        <button onClick={getRecords}>Get Records</button>


        <div id="container">

          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
      </div>
    </>
  );
}

export default App;
