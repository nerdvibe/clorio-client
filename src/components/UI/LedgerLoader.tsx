import Animation from "../UI/Animation";
import ConnectAnimation from "../../assets/connect.json";

const LedgerLoader = () => (
  <div>
    <Animation
      width="400px"
      animation={ConnectAnimation}
      text="Looking for devices"
    />
  </div>
);

export default LedgerLoader;
