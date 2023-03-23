

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
}) {

  // const newAmount = document.getElementById('new-amount').value;

  return (
    <div className="existing-contract">
      <ul className="fields">
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
        <div>
          <label>
            New deposit Amount
            <input type="text" id="new-amount"></input>
            <div className="button">Submit New Amount</div>
          </label>
        </div>
      </ul>
    </div>
  );
}
