import {useMemo} from 'react';
import {Server} from 'react-feather';
import ReactTooltip from 'react-tooltip';
import Button from '../../UI/Button';
import StakeTableRow from '../stakeTableRow/StakeTableRow';
import StakeStatus from '../StakeStatus';
import type {IValidatorData} from '../stakeTableRow/ValidatorDataTypes';
import StakeTableError from './StakeTableError';
import Spinner from '../../UI/Spinner';
import Pagination from '../../UI/pagination/Pagination';
import {getTotalPages} from '../../../tools';
import EpochBar from '../../UI/epochBar/EpochBar';
import {useNetworkSettingsContext} from '/@/contexts/NetworkContext';
import './StakeTable.scss';

interface IProps {
  error: any;
  validators?: IValidatorData[];
  toggleModal: (element: IValidatorData) => void;
  openCustomDelegateModal: () => void;
  currentDelegate: string;
  currentDelegateName: string;
  loading: boolean;
  delegateLoading: boolean;
  page: number;
  setOffset: (page: number) => void;
  address: string;
  validatorsTotal: number;
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
  address,
  validatorsTotal,
}: IProps) => {
  const {settings} = useNetworkSettingsContext();

  const validatorsDisabled = settings?.hideValidators;
  const epochDisabled = !settings?.apiUrl;
  const totalPages = getTotalPages(validatorsTotal, false);

  const filteredValidators = useMemo(() => validators || [], [validators]);
  const hasValidatorInfo = filteredValidators.some(validator => Boolean(validator.website));
  const hasValidatorStake = filteredValidators.some(
    validator => validator.stakedSum !== undefined && validator.stakedSum !== '',
  );

  const tableRows = filteredValidators.map((validator, index) => (
    <StakeTableRow
      key={`validator-row-${validator.publicKey}-${index}`}
      element={validator}
      index={index}
      toggleModal={toggleModal}
      isDelegating={validator.publicKey === currentDelegate}
      loading={delegateLoading}
      showInfo={hasValidatorInfo}
      showStaked={hasValidatorStake}
    />
  ));

  const mobileCards = filteredValidators.map((validator, index) => (
    <StakeTableRow
      key={`validator-card-${validator.publicKey}-${index}`}
      element={validator}
      index={index}
      toggleModal={toggleModal}
      isDelegating={validator.publicKey === currentDelegate}
      loading={delegateLoading}
      mode="card"
      showInfo={hasValidatorInfo}
      showStaked={hasValidatorStake}
    />
  ));

  if (error) {
    return <StakeTableError />;
  }

  return (
    <div className="stake-table-shell">
      <section className="stake-overview-grid">
        <div className="glass-card stake-overview-card">
          <StakeStatus
            currentDelegate={currentDelegate}
            currentDelegateName={currentDelegateName}
            address={address}
          />
        </div>
        <div className={`glass-card stake-overview-card ${epochDisabled ? 'disabled-glass-card' : ''}`}>
          <EpochBar />
        </div>
      </section>

      <section className={`glass-card stake-table-panel ${validatorsDisabled ? 'disabled-glass-card' : ''}`}>
        <div className="stake-table-panel__header">
          <div className="stake-table-panel__copy">
            <span className="stake-table-panel__eyebrow">Delegation marketplace</span>
            <h2 className="stake-table-panel__title">Delegates</h2>
            <p className="stake-table-panel__subtitle">
              Compare validator fees and stake distribution before delegating.
            </p>
          </div>
          <Button
            className="stake-table-panel__cta"
            text="Custom delegation"
            onClick={openCustomDelegateModal}
            style="quiet"

            size="sm"
          />
        </div>

        {validatorsDisabled ? (
          <div className="stake-table-panel__empty">
            The validators list is not available for this network.
          </div>
        ) : (
          <Spinner
            className="full-width"
            show={loading}
          >
            <ReactTooltip multiline={true} />

            {filteredValidators.length === 0 ? (
              <div className="stake-table-panel__empty-state">
                <div className="stake-table-panel__empty-icon">
                  <Server size={22} />
                </div>
                <h3>No validators available</h3>
                <p>There are no validators to display for this network right now.</p>
              </div>
            ) : (
              <>
                <div className="stake-table-wrapper">
                  <table className="stake-table">
                    <thead>
                      <tr>
                        <th scope="col">Validator</th>
                        <th scope="col">Fee</th>
                        {hasValidatorStake && <th scope="col">Staked</th>}
                        {hasValidatorInfo && <th scope="col">Info</th>}
                        <th
                          scope="col"
                          className="stake-table__th-action"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>{tableRows}</tbody>
                  </table>
                </div>

                <div className="stake-card-list">{mobileCards}</div>

                <Pagination
                  page={page}
                  setOffset={setOffset}
                  total={totalPages}
                />
              </>
            )}
          </Spinner>
        )}
      </section>
    </div>
  );
};

export default StakeTable;
