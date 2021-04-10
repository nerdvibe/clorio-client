import { Nav } from "react-bootstrap";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Cpu, LogIn, TrendingUp, Edit3, Check } from "react-feather";
import Logo from "../logo/Logo";
import { clearSession } from "../../../tools";
import { isRouteActiveClass, renderNetworkLabel } from "./SidebarHelper";
import { INetworkData } from "../../../types/NetworkData";

interface IProps {
  network: INetworkData;
  clearSessionData: () => void;
  toggleLoader: (state?: boolean) => void;
}

const Sidebar = ({ network, clearSessionData }: IProps) => {
  const history = useHistory();
  const statusDot = network?.nodeInfo ? (
    <span className="green-dot" />
  ) : (
    <span className="red-dot" />
  );

  /**
   * Clear session data and go back to splashscreen
   */
  const logout = () => {
    clearSession();
    history.replace("/");
    clearSessionData();
  };

  return (
    <div style={{ padding: "5px" }}>
      <Nav
        className="col-md-12 d-none d-md-block sidebar level-zero"
        activeKey="/home"
        onSelect={selectedKey => alert(`selected ${selectedKey}`)}>
        <div className="sidebar-sticky" style={{ margin: "0 auto" }}>
          <Logo />
        </div>
        <hr />
        <Nav.Item
          className={
            "sidebar-item-container " + isRouteActiveClass("overview")
          }>
          <Link to="/overview" className="sidebar-item selected-item">
            {" "}
            <span>
              <Cpu /> Overview
            </span>
          </Link>
        </Nav.Item>
        <Nav.Item
          className={"sidebar-item-container " + isRouteActiveClass("send-tx")}>
          <Link to="/send-tx" className="sidebar-item">
            {" "}
            <span>
              <LogIn /> Send TX
            </span>
          </Link>
        </Nav.Item>
        <Nav.Item
          className={"sidebar-item-container " + isRouteActiveClass("stake")}>
          <Link to="/stake" className="sidebar-item">
            {" "}
            <span>
              <TrendingUp /> Staking Hub
            </span>
          </Link>
        </Nav.Item>
        <Nav.Item
          className={
            "sidebar-item-container " + isRouteActiveClass("sign-message")
          }>
          <Link to="/sign-message" className="sidebar-item">
            {" "}
            <span>
              <Edit3 /> Sign message
            </span>
          </Link>
        </Nav.Item>
        <Nav.Item
          className={
            "sidebar-item-container " + isRouteActiveClass("verify-message")
          }>
          <Link to="/verify-message" className="sidebar-item">
            {" "}
            <span>
              <Check /> Verify message
            </span>
          </Link>
        </Nav.Item>
        <div className="sidebar-footer-block">
          <Nav.Item className=" sidebar-footer">
            <Link to="/" className="sidebar-item">
              {" "}
              <strong>
                {" "}
                <span onClick={logout}>Logout</span>
              </strong>{" "}
            </Link>
          </Nav.Item>
          <div className="sidebar-footer-network">
            {renderNetworkLabel(network?.nodeInfo)} {statusDot}
          </div>
        </div>
      </Nav>
    </div>
  );
};

export default Sidebar;
