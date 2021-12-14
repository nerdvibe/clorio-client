import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

export const MIN_SLOT = 0;
export const MAX_SLOT = 7140;
export const SLOT_DURATION = 180000;

interface RemainingTime {
  days: number;
  hours: number;
  minutes: number;
}

const EpochBar = () => {
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
    const data = await fetch(process.env.REACT_APP_EPOCH_URL || "")
      .then((response) => response.json())
      .then((data) => data);
    const realSlot = +data.slot % (MAX_SLOT + 1);
    const lastTime = ((MAX_SLOT - +realSlot) * SLOT_DURATION) / 1000;
    setEpochData(data);
    setRemainingTime(calculateTime(lastTime));
    setPercentage(parseInt(((100 * +realSlot) / MAX_SLOT).toFixed(0)));
  };

  return (
    <div className="w-100 h-80">
      <div className="progress-bar-container mx-auto w-100">
        <Row>
          <Col xs={1}>
            <h6 className="light-grey-text">Epoch</h6>
            <h4>{+epochData.epoch}</h4>
          </Col>
          <Col xs={10}>
            <div className="loading w-100 mt-3">
              <div
                className="loading-after"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <Row>
              <Col xs={6} className="text-left">
                <strong>{percentage}%</strong>
                <p>
                  Slot {epochData.slot} of {MAX_SLOT}
                </p>
              </Col>
              <Col xs={6} className="align-end">
                {remainingTime && (
                  <strong>
                    {remainingTime.days} days {remainingTime.hours} hours{" "}
                    {remainingTime.minutes} minutes left to the next epoch
                  </strong>
                )}
              </Col>
            </Row>
          </Col>
          <Col xs={1} className="pl-0">
            <h6 className="light-grey-text">Epoch</h6>
            <h4>{+epochData.epoch + 1}</h4>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EpochBar;
