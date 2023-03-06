import {
  HiArrowDown,
  HiOutlineArrowNarrowRight,
  HiOutlineMoon,
} from "react-icons/hi";

import HomeLogo from "../../assets/home-main.svg";
import "./Home.scss";

const Home = () => {
  return (
    <div>
      <div className="container">
        <div className="text-container">
          <p className="text">
            I am Pranav, a{" "}
            <div className="gradient-text">full stack developer </div>
            and an <p className="gradient-text">open sourcer</p>
          </p>
          <div className="button-container">
            <div
              className="button-light m2 mb5"
              onClick={() => {
                console.log("clicked");
              }}
            >
              Download CV
            </div>
            <div
              className="button-dark m2 mt5"
              onClick={() => {
                console.log("clicked");
              }}
            >
              View work
            </div>
          </div>
        </div>
        <img
          src={HomeLogo}
          alt="home pic"
          className="img-fluid"
          style={{ maxHeight: "650px" }}
        />
      </div>
      <div className="more-container">
        <div className="icon mr5">
          <HiArrowDown size={25} />
        </div>
        <p className="subText ml5">Learn more about Pranav</p>
      </div>
    </div>
  );
};

export default Home;
