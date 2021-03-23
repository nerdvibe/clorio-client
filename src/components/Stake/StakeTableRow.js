import React from "react";
import Button from "../General/Button";
import StakeTableValue from "./StakeTableValue";
import Avatar from "../../tools/avatar";

export default function StakeTableRow({index, element, toggleModal}) {
  return (
      <tr key={index} className="stake-table-row">
        <StakeTableValue
          avatar={
            <div className="walletImageContainer small-image inline-element">
              {element.image ? (
                <img className="small-walletImage" src={element.image} />
              ) : (
                <Avatar
                  className="small-walletImage"
                  address={element.publicKey}
                  size="30"
                />
              )}
            </div>
          }
          header="Validator"
          text={element.name}
          className="table-element"
        />
        <StakeTableValue className="table-element" header={"Commission"} text={`${element.fee}%`} />
        <StakeTableValue className="table-element" header={"Staked"} text={parseInt(element.stakedSum)} />
        <StakeTableValue className="table-element" header={"info"} text={"Website"} website={element.website} />
        <td className="table-element stake-table-button">
          <Button
            className="yellowButton__fullMono"
            text="Delegate"
            onClick={() => toggleModal(element)}
          />
        </td>
      </tr>
  );
}
