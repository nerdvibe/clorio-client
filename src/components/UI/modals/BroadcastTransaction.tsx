import Animation from "../Animation";
import BroadcastingAnimation from "./assets/broadcasting.json";

export const BroadcastTransaction = () => (
  <div className="mx-auto">
    <h2>Broadcasting your transaction</h2>
    <div className="v-spacer" />
    <h5 className="align-center mx-auto">
      We are broadcasting your transaction to the network
    </h5>
    <div className="v-spacer" />
    <Animation animation={BroadcastingAnimation} />
  </div>
);
