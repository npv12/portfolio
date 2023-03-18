import { Link } from "react-router-dom";
import { conflicts } from "yargs";
import tailwind from "../../assets/image.jpg";
import flipkart from "./images/titleImage.jpg"
import "./Flipkart.scss";


interface IProps {
  style?: any;
  source: { dominantColor: string; thumbnail: string };
}

const FlipkartCard = () => {
  const logfn = ()=>{
    console.log("click");
  }
  return (
    <>

    <Link style={{ backgroundImage: `url(${flipkart})` }} className="card" to="/FlipkartRoute">
      <p className="card-text">Flipkart GRiD 3.0</p>
    </Link>
    </>
    
  );
};

export default FlipkartCard;
