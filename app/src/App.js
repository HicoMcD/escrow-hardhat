import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import { Polybase } from "@polybase/client";
import { useAuth } from "@polybase/react";

import EscrowABI from './artifacts/contracts/Escrow.sol/Escrow';

const db = new Polybase({
  defaultNamespace: "pk/0x8318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5/Escrow" //process.env.ESCROW_REACT_NAMESPACE, //
});
const collectionReference = db.collection("AUEscrowTT");

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer, id) {
  const approveTxn = await escrowContract.connect(signer).approve();
  const tx = await approveTxn.wait();
  await db.collection("AUEscrowTT").record(id).call("updateIsApproved", []) 
  
  console.log(tx)
}

function App() {
  const { auth } = useAuth()

  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  const sign = db.signer(async (data) => {
    return {
      h: 'eth-personal-sign',
      sig: await auth.ethPersonalSign(data),
    }
  })

  const connectWallet = async () => {
    const accounts = await provider.send('eth_requestAccounts', []);

    setAccount(accounts[0]);
    setSigner(provider.getSigner());
  }

  window.ethereum.on('accountsChanged', handleAccountsChanged);

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
    }
  }
  
  useEffect(() => {
    const getRecords = async() => {
      const data = await collectionReference.get();
      const records = data.data;

      const tempRecords = records.map((record, index) => {

        const contract = new ethers.Contract(record.data.escrowAddress, EscrowABI.abi, provider.getSigner())

          const escrow = {
            address: record.data.escrowAddress,
            arbiter: record.data.arbiter,
            beneficiary: record.data.beneficiary,
            value: record.data.value,
            id: record.data.id,     
            isApproved: record.data.isApproved.toString(),
            handleApprove: async () => {
                contract.on('Approved', () => {
                  document.getElementById(contract.address).className =
                  'complete';
                  document.getElementById(contract.address).innerText =
                  "✓ It's been approved!";
                });

              await approve(contract, provider.getSigner(), record.data.id, sign);

            },      
        }

        return escrow
      });
      
      setEscrows(tempRecords);
    }

    getRecords()
  }, [sign])

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = ethers.utils.parseEther(document.getElementById('ether').value); 
    let escrowContract

    if(!signer) {
      alert('Connect Wallet')
    } else {
      escrowContract = await deploy(signer, arbiter, beneficiary, value);
    }

    const escrow = {
      address: escrowContract.address,
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

        await approve(escrowContract, signer, newRecordID, sign);
      },
    };

    //Polybase
    db.signer(async (data) => {
      return {
        h: 'eth-personal-sign',
        sig: await auth.ethPersonalSign(data),
      }
    })

    const records = await collectionReference.get()
    const recordsLength = records.data.length;
    const newRecord = recordsLength + 1;
    const newRecordID = String(newRecord);

    await collectionReference.create([
      newRecordID,
      escrowContract.address.toString(),
      account.toString(),
      arbiter,
      beneficiary,
      value.toString(),
      false
      ])

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
    <div className='wrapper'>
    <div className='contract-wrapper'>

      <div className='header'>
        <h1> Deploy New Escrow Contract </h1>
        <div className='wallet-address'>Wallet Address <strong>{account}</strong></div>
        <div></div>
        <button className='connect-btn' onClick={connectWallet}>Connect Wallet</button>
      </div>
      <div className="contract">
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in ETH)
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
      </div>

      <div className="existing-contracts-wrapper">
      <div className="existing-contracts">
        <h1 style={{'color': 'white'}}> Deployed Escrow Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
      </div>
      </div>
    </>
  );
}

export default App;
