import { ethers } from 'ethers';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';


const ViewDeployedEscrows = () => {
    // const provider = ethers.getDefaultProvider('http://localhost:8545')

    // const contract = new ethers.Contract('0xf5f4f95a1e2c01e1c441c4360d5cb10b38bcbbe6', Escrow, provider)
    // const contractInstance = contract.attach('0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e');
    // console.log(contractInstance);

    return (
        <div>View Deployed Escrow Contracts</div>
    )
}

export default ViewDeployedEscrows;