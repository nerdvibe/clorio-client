import React, { useState } from "react";
import Button from "../components/Button";
import { Table } from "react-bootstrap";
import StakeTableValue from "../components/StakeTableValue";
import Spinner from "./General/Spinner";
import Avatar from "../tools/avatar";
import ErrorImage from "../assets/Error.svg";
import { Row, Col } from "react-bootstrap";

export default function StakeTable(props) {
  const [page, setpage] = useState(props.page);
  const maxPages = props.total;
  const [searchbox, setSearchbox] = useState("");

  const searchboxHandler = (search) => {
    setSearchbox(search.toLowerCase());
  };

  return (
    <div className="mx-auto  ">
      <div className="block-container-last  py-50">
        <div>
          <Row>
            <Col>{renderStatus()}</Col>
            <Col className="align-end">{renderAddDelegate()}</Col>
          </Row>
          <div className="v-spacer" />
          {renderTable()}
        </div>
      </div>
    </div>
  );

  function renderStatus() {
    if (!props.currentDelegate) {
      return (
        <div>
          <h4>Your status</h4>
          <h6 className="full-width-align-left">
            Cannot get your current status
          </h6>
        </div>
      );
    }
    return (
      <div>
        <h4>Your status</h4>
        <h6 className="full-width-align-left">
          Your are staking for {props.currentDelegate || "None"}
        </h6>
      </div>
    );
  }

  function renderTable() {
    if (props.validators.error) {
      return (
        <div className="block-container-last">
          <div className="full-width padding-y-50">
            <img src={ErrorImage} />
          </div>
        </div>
      );
    }
    return (
      <Spinner className={"full-width"} show={props.validators.loading}>
        <Table>
          <thead>
            <tr className="th-background">
              <th className="th-first-item">Stake</th>
              <th></th>
              <th></th>
              <th></th>
              <th className="th-last-item">
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
        {renderPagination()}
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
      <tr key={index}>
        <StakeTableValue
          avatar={
            <div className="walletImageContainer small-image inline-element">
              <div className="">
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
            </div>
          }
          header="Validator"
          text={el.name}
        />
        <StakeTableValue header={"Uptime"} text={"100%"} />
        <StakeTableValue header={"Commission"} text={`${el.fee}%`} />
        <StakeTableValue header={"Staked"} text={"200 MINA"} />
        <td>
          <Button
            className="yellowButton__fullMono"
            text="Delegate"
            onClick={() => props.toggleModal(el)}
          />
        </td>
      </tr>
    );
  }

  function renderPagination() {
    const indexes = [];
    for (let i = 1; i <= maxPages; i++) {
      indexes.push(i);
    }
    function changePage(index) {
      const lastIndex = indexes.length - 1;
      if (index > 0 && index <= indexes[lastIndex]) {
        setpage(index);
        props.setOffset(index);
      }
    }
    function indexToRender() {
      const indexToReturn = [];
      let count = 0;
      if (page > 2 && page < indexes.length - 2) {
        const tmpIndex = page - 2;
        while (count < 5) {
          indexToReturn.push(tmpIndex + count);
          count++;
        }
      } else if (page <= 2) {
        const min = maxPages <= 5 ? maxPages : 5;
        while (count < min) {
          indexToReturn.push(1 + count);
          count++;
        }
      } else {
        if (maxPages <= 5) {
          const tmpFirstIndex = indexes.length - (maxPages - 1);
          while (count < maxPages) {
            indexToReturn.push(tmpFirstIndex + count);
            count++;
          }
        } else {
          const tmpFirstIndex = indexes.length - 4;
          while (count < 5) {
            indexToReturn.push(tmpFirstIndex + count);
            count++;
          }
        }
      }
      return indexToReturn;
    }
    const elements = indexToRender().map((index) => {
      return renderPaginationItem(index, changePage);
    });
    return (
      <div className="pagination">
        <p onClick={() => changePage(page - 1)}>&laquo;</p>
        {elements}
        <p onClick={() => changePage(page + 1)}>&raquo;</p>
      </div>
    );
  }

  function renderPaginationItem(index, change) {
    return (
      <p
        key={index}
        onClick={() => change(index)}
        className={page === index ? "active" : ""}
      >
        {index}
      </p>
    );
  }

  function renderAddDelegate() {
    return (
      <Button
        className="link-button"
        text="Custom delegation"
        onClick={props.openCustomDelegateModal}
      />
    );
  }
}
