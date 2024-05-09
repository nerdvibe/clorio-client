import {useEffect, useState} from 'react';
import {useNetworkSettingsContext} from '/@/contexts/NetworkContext';

export const MIN_SLOT = 0;
export const MAX_SLOT = 7140;
export const SLOT_DURATION = 180000;

interface RemainingTime {
  days: number;
  hours: number;
  minutes: number;
}

const EpochBar = () => {
  const {settings} = useNetworkSettingsContext();
  const [epochData, setEpochData] = useState({
    slot: 0,
    epoch: 0,
  });
  const [percentage, setPercentage] = useState(0);
  const [remainingTime, setRemainingTime] = useState<RemainingTime>({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  const calculateTime = (time: number) => {
    const days = Math.floor(time / 60 / 60 / 24);
    const leave1 = time % (24 * 3600);
    const hours = Math.floor(leave1 / 3600);
    const leave2 = leave1 % 3600;
    const minutes = Math.floor(leave2 / 60);
    return {
      days,
      hours,
      minutes,
    };
  };

  useEffect(() => {
    fetchEpochData();
  }, []);

  const fetchEpochData = async () => {
    const data = await fetch(settings?.epochUrl || '')
      .then(response => response.json())
      .then(data => data);
    const realSlot = +data.slot % (MAX_SLOT + 1);
    const lastTime = ((MAX_SLOT - +realSlot) * SLOT_DURATION) / 1000;
    setEpochData(data);
    setRemainingTime(calculateTime(lastTime));
    setPercentage(parseInt(((100 * +realSlot) / MAX_SLOT).toFixed(0)));
  };

  if (!settings?.epochUrl) {
    return (
      <div
        className="w-100 h-80"
        style={{minWidth: '400px'}}
      >
        <div
          className="progress-bar-container mx-auto w-100 flex items-center"
          style={{height: '104px'}}
        >
          Epoch currently unavailable
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-100 h-80"
      style={{minWidth: '400px'}}
    >
      <div
        className="progress-bar-container mx-auto w-100 flex items-center"
        style={{height: '104px'}}
      >
        <div className="flex flex-row gap-4 w-100">
          <div className="">
            <p className="light-grey-text">Epoch</p>
            <h4 className="">{+epochData.epoch}</h4>
          </div>
          <div className="progress-bar-col w-100">
            <div className="loading w-100">
              <div
                className="loading-after"
                style={{width: `${percentage}%`}}
              ></div>
            </div>
            <div className="flex flex-row justify-between">
              <div>
                <p
                  className="value-text align-left"
                  style={{lineHeight: '17px'}}
                >
                  {percentage}% <br />
                  Slot {epochData.slot} of {MAX_SLOT}
                </p>
              </div>
              <div>
                {remainingTime && (
                  <p className="value-text align-end">
                    {!!remainingTime.days && `${remainingTime.days} days`}{' '}
                    {(!!remainingTime.days || !!remainingTime.hours) &&
                      `${remainingTime.hours} hours`}{' '}
                    {!remainingTime.days && `${remainingTime.minutes} minutes`} <br />
                    left to the next epoch
                  </p>
                )}
              </div>
            </div>
          </div>
          <div>
            <p className="light-grey-text">Epoch</p>
            <h4 className="ml-2">{+epochData.epoch + 1}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpochBar;
