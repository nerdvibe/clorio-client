import Animation from "../Animation";
import BroadcastingAnimation from "./assets/broadcasting.json";

const INFINITE_TIMEOUT = 99999999;

export const BroadcastTransaction = () => (
  <div>
    <div className="w-75 mx-auto ">
      <Animation
        animation={BroadcastingAnimation}
        maxWidth="700px"
        timeout={INFINITE_TIMEOUT}
      />
    </div>
    <p className="mb-0 mx-auto">
      We are broadcasting your transaction to the network
    </p>
  </div>
);
