import HomeLogo from "../../assets/home-main.svg";
import "../../button-fill.scss";
import "./Home.scss";

const Home = () => {
  return (
    <div>
      <div className="home-container">
        <div className="home-text-container">
          <p className="text">
            I am Pranav, a{" "}
            <div className="gradient-text-red">full stack developer </div>
            and an <p className="gradient-text-red">open sourcer</p>
          </p>
          <div
            className="home-button-light m2 mb5"
            onClick={() => {
              console.log("clicked");
            }}
          >
            Download CV
          </div>
          <div
            className="home-button-dark m2 mt5"
            onClick={() => {
              console.log("clicked");
            }}
          >
            View work
          </div>
        </div>
        <img
          src={HomeLogo}
          alt="home pic"
          className="img-fluid"
          style={{ maxHeight: "650px" }}
        />
      </div>
      <div className="home-more-container">
        <button type="button" className="w-btn-circle w-btn-circle--close mr5">
          <div className="btn-circle-container">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 56 56"
            >
              <circle
                className="btn-circle"
                cx="28"
                cy="28"
                r="27"
                fill="none"
                stroke="#000"
                stroke-width="3"
              />
              <circle
                className="btn-circle-prog"
                cx="28"
                cy="28"
                r="27"
                fill="none"
                stroke="#000"
                stroke-width="3"
              />
            </svg>
          </div>
        </button>
        <p className="subText ml5">Learn more about Pranav</p>
      </div>
    </div>
  );
};

export default Home;
