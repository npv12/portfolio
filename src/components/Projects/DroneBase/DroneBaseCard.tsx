import { Link } from "react-router-dom";
import { conflicts } from "yargs";
import tailwind from "../../../assets/image.jpg";
// import flipkart from "./images/titleImage.jpg"
import "./DroneBase.scss";


interface IProps {
  style?: any;
  source: { dominantColor: string; thumbnail: string };
}

const DroneBasecard = () => {
  const logfn = ()=>{
    console.log("click");
  }
  return (
    <>

    <Link style={{ backgroundImage: `url(${tailwind})` }} className="card" to="/FlipkartRoute">
      <p className="card-text">Solar Panel Robot</p>
    </Link>
    </>
    
  );
};

export default DroneBasecard;
