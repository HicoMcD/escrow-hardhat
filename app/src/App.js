import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import EscrowABI from './artifacts/contracts/Escrow.sol/Escrow';
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

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());


    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    // const valueBN = ethers.BigNumber.from(document.getElementById('wei').value);
    const value = ethers.utils.parseEther(document.getElementById('ether').value)
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: '0xf5f4f95a1e2c01e1c441c4360d5cb10b38bcbbe6', //escrowContract.address,
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
    const lastRecordID = Number(lastRecord.data.id)
    const newRecord = lastRecordID + 1;
    const newRecordID = String(newRecord);

    const recordData = await collectionReference.create([
      newRecordID,
      account.toString(),
      escrowContract.address.toString()
      ])

    console.log(recordData);
    console.log(escrowContract.address)
    setEscrows([...escrows, escrow]);
  }

  const contract = new ethers.Contract('0xf5f4f95a1e2c01e1c441c4360d5cb10b38bcbbe6', EscrowABI.abi, signer)
  const contractInstance = contract.attach('0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e')
  // console.log(contractInstance)

  const Helper = async () => {
    const arbiterC = await contractInstance.arbiter()
    const arbiter = arbiterC.toString()
    console.log(arbiter)

    return(
      <div>arbiter</div>
    )
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

        {/* <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div> */}
      </div>
      </div>
    </>
  );
}

export default App;
