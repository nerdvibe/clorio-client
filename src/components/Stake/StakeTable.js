import React, { useState } from "react";
import Button from "../General/Button";
import { Table } from "react-bootstrap";
import Spinner from "../General/Spinner";
import Pagination from "../General/Pagination";
import ErrorImage from "../../assets/Error.svg";
import { Row, Col } from "react-bootstrap";
import StakeStatus from "./StakeStatus";
import { useQuery, gql } from "@apollo/client";
import StakeTableRow from "./StakeTableRow";
import ReactTooltip from "react-tooltip";
import Hoc from "../General/Hoc";

const ITEMS_PER_PAGE = 100;

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
  const [searchBox, setSearchBox] = useState("");
  const total = useQuery(GET_VALIDATORS_TOTAL);

  const searchBoxHandler = (search) => {
    setSearchBox(search.toLowerCase());
  };

  if (props.validators.error) {
    return (
      <div className="block-container">
        <div className="full-width padding-y-50">
          <img src={ErrorImage} />
        </div>
      </div>
    );
  }

  const tableBody = () => {
    if (props.validators.data && props.validators.data.validators) {
      const filteredValidators = props.validators.data.validators.filter((el) =>
        el.name.toLowerCase().includes(searchBox)
      );
      return (
        <tbody>
          {filteredValidators.map((el, index) => {
            return <StakeTableRow element={el} index={index} toggleModal={props.toggleModal}/>
          }) }
        </tbody>
      );
    }
    return <tbody />;
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

  const customDelegation = (
    <Button
        className="link-button custom-delegate-button"
        text="Custom delegation"
        onClick={props.openCustomDelegateModal}
      />
    );


  return (
    <div className="mx-auto  ">
      <div className="block-container  py-50">
        <div>
          <Row>
            <Col md={12} lg={12} xl={8} className="stake-status-container">
              <StakeStatus currentDelegate={props.currentDelegate} currentDelegateName={props.currentDelegateName} />
            </Col>
            <Col md={5} lg={4} xl={3} className="align-end small-screen-align-left">
              {customDelegation}
            </Col>
          </Row>
          <div className="v-spacer" />
            <Spinner className={"full-width"} show={props.validators.loading}>
              <div id="transaction-table">
                <Table id="rwd-table-large">
                  <thead>
                  <tr className="th-background">
                    <th className="th-first-stake-item stake-th">Stake</th>
                    <th className="stake-fee-th"></th>
                    <th className="stake-staked-th"></th>
                    <th></th>
                    <th className="th-last-item" >
                      <input
                        className="table-searchbar"
                        placeholder={"Filter..."}
                        value={searchBox}
                        onChange={(e) => searchBoxHandler(e.currentTarget.value)}
                      />
                    </th>
                  </tr>
                  </thead>
                  {tableBody()}
                  <ReactTooltip multiline={true} />
                </Table>
              </div>
              <Pagination
                page={props.page}
                total={getTotalPages()}
                setOffset={props.setOffset}
              />
            </Spinner>
        </div>
      </div>
    </div>
  );
}
