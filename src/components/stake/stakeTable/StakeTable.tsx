import { useState } from "react";
import Button from "../../UI/Button";
import StakeTableRow from "../stakeTableRow/StakeTableRow";
import { Row, Col, Table } from "react-bootstrap";
import StakeStatus from "../StakeStatus";
import ReactTooltip from "react-tooltip";
import { IValidatorData } from "../stakeTableRow/ValidatorDataTypes";
import StakeTableError from "./StakeTableError";
import Spinner from "../../UI/Spinner";
import Pagination from "../../UI/pagination/Pagination";
import { GET_VALIDATORS_TOTAL } from "../../../graphql/query";
import { getTotalPages } from "../../../tools";
import { useQuery } from "@apollo/client";
import EpochBar from "../../UI/epochBar/EpochBar";

interface IProps {
  error: any;
  validators: IValidatorData[];
  toggleModal: (element: IValidatorData) => void;
  openCustomDelegateModal: () => void;
  currentDelegate: string;
  currentDelegateName: string;
  loading: boolean;
  delegateLoading: boolean;
  page: number;
  setOffset: (page: number) => void;
}

const StakeTable = ({
  error,
  validators,
  toggleModal,
  openCustomDelegateModal,
  currentDelegate,
  currentDelegateName,
  loading,
  delegateLoading,
  setOffset,
  page,
}: IProps) => {
  const [searchBox] = useState<string>("");
  const { data: validatorsTotalData } = useQuery(GET_VALIDATORS_TOTAL);

  const totalPages = getTotalPages(
    validatorsTotalData?.validators_aggregate?.aggregate?.count || 0,
    false
  );
  /**
   * Store search text inside component state (temporarily disabled, needs backend search query)
   * @param search string Search text
   */
  // const searchBoxHandler = (search: string) => {
  //   setSearchBox(search.toLowerCase());
  // };

  const tableBody = () => {
    if (validators) {
      const filteredValidators = validators.filter((el) =>
        el?.name?.toLowerCase().includes(searchBox)
      );
      return (
        <tbody>
          {filteredValidators.map((el, index: number) => {
            const isDelegating = el.publicKey === currentDelegate;
            return (
              <StakeTableRow
                key={index}
                element={el}
                index={index}
                toggleModal={toggleModal}
                isDelegating={isDelegating}
                loading={delegateLoading}
              />
            );
          })}
        </tbody>
      );
    }
    return <tbody />;
  };

  if (error) {
    return <StakeTableError />;
  }

  return (
    <div>
      <Row>
        <Col xs={12} xl={6} className="pr-1">
          <div className="glass-card p-4 mt-2 center-content flex-col-left h-95 flex flex-vertical-center stake-info-left">
            <div className="w-100">
              <StakeStatus
                currentDelegate={currentDelegate}
                currentDelegateName={currentDelegateName}
              />
            </div>
          </div>
        </Col>
        <Col xs={12} xl={6} className="pl-1">
          <div className="glass-card p-4 mt-2 center-content flex-col-left stake-info-right">
            <div className="w-100 mt-2">
              <EpochBar />
            </div>
          </div>
        </Col>
      </Row>
      <div className="glass-card p-4 mt-2  py-50">
        <div>
          <Row>
            <Col className="mt-0">
              <h2>Delegates</h2>
            </Col>
            <Col
              md={3}
              lg={4}
              xl={3}
              className="align-end small-screen-align-left"
            >
              <Button
                className="link-button custom-delegate-button"
                text="Custom delegation"
                onClick={openCustomDelegateModal}
              />
            </Col>
          </Row>
          <Spinner className={"full-width"} show={loading}>
            <div id="transaction-table">
              <Table id="rwd-table-large">{tableBody()}</Table>
              &nbsp;
              <ReactTooltip multiline={true} />
            </div>
          </Spinner>
          <Pagination page={page} setOffset={setOffset} total={totalPages} />
        </div>
      </div>
    </div>
  );
};

export default StakeTable;
