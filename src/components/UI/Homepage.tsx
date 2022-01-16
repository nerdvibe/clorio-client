import { Link } from "react-router-dom";
import Footer from "./Footer";
import Logo from "./logo/Logo";

const Homepage = () => {
  return (
    <div className="full-screen-container-center">
      <div className="homepage-card glass-card flex md-flex-col">
        <div className="half-card">
          <div className="flex flex-col">
            <Logo big />
            <p className="text-center mt-3">
              Access the power of the Mina Protocol Blockchain.
            </p>
          </div>
        </div>
        <div className="half-card flex flex-col">
          <Link to={"register"}>
            <div className="button primary">
              <span className="button-helper"></span>
              Create new
            </div>
          </Link>
          <p className="w-100 text-center mt-4 mb-4">or</p>
          <Link to={"login-selection"}>
            <div className="button primary">
              <span className="button-helper"></span>
              Log-in
            </div>
          </Link>
        </div>
        <div className="mt-4">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
