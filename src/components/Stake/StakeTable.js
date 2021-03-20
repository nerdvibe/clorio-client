import React, { useState } from "react";
import Button from "../General/Button";
import { Table } from "react-bootstrap";
import StakeTableValue from "./StakeTableValue";
import Spinner from "../General/Spinner";
import Pagination from "../General/Pagination";
import Avatar from "../../tools/avatar";
import ErrorImage from "../../assets/Error.svg";
import { Row, Col } from "react-bootstrap";
import StakeStatus from "./StakeStatus";
import { useQuery, gql } from "@apollo/client";

const ITEMS_PER_PAGE = 10;

const GET_VALIDATORS_TOTAL = gql`
  query CountValidators {
    validators_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export default function StakeTable(props) {
  const [searchbox, setSearchbox] = useState("");
  const total = useQuery(GET_VALIDATORS_TOTAL);

  const searchboxHandler = (search) => {
    setSearchbox(search.toLowerCase());
  };

  function renderTable() {
    if (props.validators.error) {
      return (
        <div className="block-container">
          <div className="full-width padding-y-50">
            <img src={ErrorImage} />
          </div>
        </div>
      );
    }
    return (
      <Spinner className={"full-width"} show={props.validators.loading}>
        <div id="transaction-table">
          <Table id="rwd-table-large">
            <thead>
              <tr className="th-background">
                <th className="th-first-item stake-th">Stake</th>
                <th></th>
                <th></th>
                <th></th>
                <th className="th-last-item" >
                  <input
                    className="table-searchbar"
                    placeholder={"Filter..."}
                    value={searchbox}
                    onChange={(e) => searchboxHandler(e.currentTarget.value)}
                  />
                </th>
              </tr>
            </thead>
            {renderTableBody()}
          </Table>
        </div>
        <Pagination
          page={props.page}
          total={getTotalPages()}
          setOffset={props.setOffset}
        />
      </Spinner>
    );
  }

  function renderTableBody() {
    if (props.validators.data && props.validators.data.validators) {
      const filteredValidators = props.validators.data.validators.filter((el) =>
        el.name.toLowerCase().includes(searchbox)
      );
      return (
        <tbody>
          {filteredValidators.map((el, index) => renderRow(el, index))}
        </tbody>
      );
    }
    return <tbody />;
  }

  function renderRow(el, index) {
    return (
      <tr key={index} className="stake-table-row">
        <StakeTableValue
          avatar={
            <div className="walletImageContainer small-image inline-element">
                {el.image ? (
                  <img className="small-walletImage" src={el.image} />
                ) : (
                  <Avatar
                    className="small-walletImage"
                    address={el.publicKey}
                    size="30"
                  />
                )}
            </div>
          }
          header="Validator"
          text={el.name}
          className="table-element"
        />
        <StakeTableValue className="table-element" header={"Uptime"} text={"100%"} />
        <StakeTableValue className="table-element" header={"Commission"} text={`${el.fee}%`} />
        <StakeTableValue className="table-element" header={"Staked"} text={"200 Mina"} />
        <td className="table-element stake-table-button">
          <Button
            className="yellowButton__fullMono"
            text="Delegate"
            onClick={() => props.toggleModal(el)}
          />
        </td>
      </tr>
    );
  }

  function getTotalPages() {
    if (total.data && total.data.validators_aggregate) {
      const totalItems = total.data.validators_aggregate.aggregate.count;
      const pages = (totalItems / ITEMS_PER_PAGE).toFixed(0);
      if(totalItems%ITEMS_PER_PAGE < 5 && totalItems%ITEMS_PER_PAGE!==0){
        return parseInt(pages) === 0 ? 1 : parseInt(pages)+1;
      }
      return parseInt(pages) === 0 ? 1 : pages;
    }
    return 1;
  }

  function renderAddDelegate() {
    return (
      <Button
        className="link-button custom-delegate-button"
        text="Custom delegation"
        onClick={props.openCustomDelegateModal}
      />
    );
  }

  return (
    <div className="mx-auto  ">
      <div className="block-container  py-50">
        <div>
          <Row>
            <Col md={12} lg={12} xl={8} className="stake-status-container">
              <StakeStatus currentDelegate={props.currentDelegate} />
            </Col>
            <Col md={5} lg={4} xl={3} className="align-end small-screen-align-left">
              {renderAddDelegate()}
            </Col>
          </Row>
          <div className="v-spacer" />
          {renderTable()}
        </div>
      </div>
    </div>
  );
}
