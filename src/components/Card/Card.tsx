import tailwind from "../../assets/image.jpg";
import "./card.scss";

interface IProps {
  style?: any;
  source: { dominantColor: string; thumbnail: string };
}

const LoadingImage = () => {
  return (
    <div style={{ backgroundImage: `url(${tailwind})` }} className="card">
      <p className="text">HEY</p>
    </div>
  );
};

export default LoadingImage;
