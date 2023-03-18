import { Link } from "react-router-dom";
import { conflicts } from "yargs";
import tailwind from "../../../assets/image.jpg";
// import tailwind from "../../../assets/";

// import flipkart from "./images/titleImage.jpg"
import "./Eyantra.scss";


interface IProps {
  style?: any;
  source: { dominantColor: string; thumbnail: string };
}

const EyantraCard = () => {
  const logfn = ()=>{
    console.log("click");
  }
  return (
    <>

    <Link style={{ backgroundImage: `url(${tailwind})` }} className="card" to="/ExoRoute">
      <p className="card-text">Autonomous Self balancing Bike</p>
    </Link>
    </>
    
  );
};

export default EyantraCard;
