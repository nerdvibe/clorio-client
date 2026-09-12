import {useQuery} from '@tanstack/react-query';
import {useNetworkSettingsContext} from '/@/contexts/NetworkContext';
import {getEpochInfo} from '/@/api/network';
import {DEFAULT_QUERY_REFRESH_INTERVAL} from '/@/tools';

export const MIN_SLOT = 0;
export const MAX_SLOT = 7140;

const EpochBar = () => {
  const {settings} = useNetworkSettingsContext();
  const {data: epochData, isError, isLoading} = useQuery({
    queryKey: ['epoch', settings?.apiUrl],
    queryFn: () => getEpochInfo(settings!.apiUrl),
    enabled: Boolean(settings?.apiUrl),
    refetchInterval: DEFAULT_QUERY_REFRESH_INTERVAL,
  });

  if (!epochData || isError) {
    return (
      <div className="epoch-widget epoch-widget--unavailable">
        <div className="epoch-widget__container">
          {isLoading ? 'Loading epoch…' : 'Epoch currently unavailable'}
        </div>
      </div>
    );
  }

  const percentage = Math.min(
    100,
    Math.round((100 * (epochData.slot % (MAX_SLOT + 1))) / MAX_SLOT),
  );

  return (
    <div className="epoch-widget">
      <div className="epoch-widget__container">
        <div className="epoch-widget__content">
          <div className="epoch-widget__marker">
            <p className="light-grey-text">Epoch</p>
            <h4>{epochData.epoch}</h4>
          </div>
          <div className="epoch-widget__progress">
            <div className="loading epoch-widget__track">
              <div
                className="loading-after"
                style={{width: `${percentage}%`}}
              />
            </div>
            <div className="epoch-widget__labels">
              <p className="value-text">
                {percentage}% <br />
                Slot {epochData.slot} of {MAX_SLOT}
              </p>
              <p className="value-text epoch-widget__remaining">
                {!!epochData.remainingTime.days && `${epochData.remainingTime.days} days`}{' '}
                {(!!epochData.remainingTime.days || !!epochData.remainingTime.hours) &&
                  `${epochData.remainingTime.hours} hours`}{' '}
                {!epochData.remainingTime.days && `${epochData.remainingTime.minutes} minutes`} <br />
                left to the next epoch
              </p>
            </div>
          </div>
          <div className="epoch-widget__marker epoch-widget__marker--next">
            <p className="light-grey-text">Epoch</p>
            <h4>{epochData.epoch + 1}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpochBar;
