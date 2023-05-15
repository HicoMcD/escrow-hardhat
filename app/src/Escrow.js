
export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
  id,
  isApproved,
}) {

const createHtml = () => {
  if(isApproved === 'true') {

    return (
      <div  
        className="complete"
        id={address}
        > 
          ✓ It's been approved!
      </div>
    )
  } else {

    return (
      <div className="button-wrapper">
      <div
          className="button"
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleApprove();

          }}
        >
          Approve
        </div>
        </div>
    )
  }
}

  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div>Escrow ID</div>
          <div>{id}</div>
        </li>
        <li>
          <div>Escrow Address</div>
          <div>{address}</div>
        </li>
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value / 10**18} ETH </div>
        </li>
        
        {createHtml()}
  
      </ul>
    </div>
  );
}
