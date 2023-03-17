import { Link } from "react-router-dom";
import { conflicts } from "yargs";
import tailwind from "../../assets/image.jpg";
import "./card.scss";

interface IProps {
  style?: any;
  source: { dominantColor: string; thumbnail: string };
}

const Card = () => {
  const logfn = ()=>{
    console.log("click");
  }
  return (

    <Link style={{ backgroundImage: `url(${tailwind})` }} className="card" to="/CardRoute">
      <p className="card-text">HEY</p>
    </Link>
  );
};

export default Card;
