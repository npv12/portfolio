import { Link } from "react-router-dom";
import { conflicts } from "yargs";
import tailwind from "../../../assets/image.jpg";
// import tailwind from "../../../assets/";

// import flipkart from "./images/titleImage.jpg"
import "./Exo.scss";


interface IProps {
  style?: any;
  source: { dominantColor: string; thumbnail: string };
}

const ExoCard = () => {
  const logfn = ()=>{
    console.log("click");
  }
  return (
    <>

    <Link style={{ backgroundImage: `url(${tailwind})` }} className="card" to="/ExoRoute">
      <p className="card-text">LowerLimb Exoskeleton</p>
    </Link>
    </>
    
  );
};

export default ExoCard;
