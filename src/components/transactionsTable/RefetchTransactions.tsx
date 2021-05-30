import { useEffect, useState } from "react";
import Button from "../UI/Button";
import { DEFAULT_REFRESH_COUNTDOWN } from "../../tools";

const RefetchTransactions = ({ refetch }: any) => {
  const [countdown, setCountdown] = useState(DEFAULT_REFRESH_COUNTDOWN);

  const countdownHandler = () => {
    if (countdown === 0) {
      refetch();
      setCountdown(DEFAULT_REFRESH_COUNTDOWN);
    } else {
      setCountdown(countdown - 1);
    }
  };

  let interval = setInterval(countdownHandler, 1000);

  /**
   * On component dismount clear interval
   */
  useEffect(() => {
    return () => {
      clearInterval(interval);
    };
  });

  /**
   * Reset countdown and refetch data
   */
  const refetchAndResetTimer = async () => {
    if (countdown !== DEFAULT_REFRESH_COUNTDOWN) {
      setCountdown(DEFAULT_REFRESH_COUNTDOWN);
      clearInterval(interval);
      interval = setInterval(countdownHandler, 1000);
      await refetch(true);
    }
  };

  if (countdown >= 20) {
    return (
      <div className="full-width-align-center small-text">Just fetched</div>
    );
  }

  return (
    <div className="full-width-align-center small-text">
      Fetching data in {countdown}s
      <Button
        className="inline-element link-button"
        text="Refresh"
        onClick={refetchAndResetTimer}
      />
    </div>
  );
};

export default RefetchTransactions;
