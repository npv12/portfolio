import { Link } from "react-router-dom";
import { conflicts } from "yargs";
import tailwind from "../../../assets/image.jpg";
// import flipkart from "./images/titleImage.jpg"
import "./CTT.scss";


interface IProps {
  style?: any;
  source: { dominantColor: string; thumbnail: string };
}

const CTTcard = () => {
  const logfn = ()=>{
    console.log("click");
  }
  return (
    <>

    <Link style={{ backgroundImage: `url(${tailwind})` }} className="card" to="/FlipkartRoute">
      <p className="card-text">Cyclone prediction analysis</p>
    </Link>
    </>
    
  );
};

export default CTTcard;
