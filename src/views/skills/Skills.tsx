import css from "../../assets/css.png";
import firebase from "../../assets/firebase.png";
import github from "../../assets/github.png";
import html from "../../assets/html.png";
import javascript from "../../assets/javascript.png";
import mongo from "../../assets/mongo.png";
import react from "../../assets/react.png";
import tailwind from "../../assets/tailwind.png";

const Skills = () => {
  return (
    <div id="skills" className="w-full h-screen bg-[#0a192f] text-gray-300">
      {/* container */}
      <div className="max-w-[1000px] mx-auto p-4 flex flex-col justify-center w-full h-full">
        <div>
          <p className="text-4xl font-bold  border-b-4 border-pink-600 inline">
            Skills
          </p>
          <p className="py-4">// these are the technologies I've work with</p>
        </div>
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 text-center">
          <div className="shadow-md shadow-[#040c16] hover:scale-110 duration-300">
            <img className="w-20 mx-auto" src={html} alt="HTML" />
            <p className="my-4">HTML</p>
          </div>
          <div className="shadow-md shadow-[#040c16] hover:scale-110 duration-300">
            <img className="w-20 mx-auto" src={css} alt="CSS" />
            <p className="my-4">CSS</p>
          </div>
          <div className="shadow-md shadow-[#040c16] hover:scale-110 duration-300">
            <img className="w-20 mx-auto" src={javascript} alt="JAVASCRIPT" />
            <p className="my-4">JAVASCRIPT</p>
          </div>
          <div className="shadow-md shadow-[#040c16] hover:scale-110 duration-300">
            <img className="w-20 mx-auto" src={tailwind} alt="TAILWIND" />
            <p className="my-4">TAILWIND CSS</p>
          </div>
          <div className="shadow-md shadow-[#040c16] hover:scale-110 duration-300">
            <img className="w-20 mx-auto" src={react} alt="REACT" />
            <p className="my-4">REACT</p>
          </div>
          <div className="shadow-md shadow-[#040c16] hover:scale-110 duration-300">
            <img className="w-20 mx-auto" src={firebase} alt="firebase" />
            <p className="my-4">FIREBASE</p>
          </div>
          <div className="shadow-md shadow-[#040c16] hover:scale-110 duration-300">
            <img className="w-20 mx-auto" src={mongo} alt="MONGO" />
            <p className="my-4">MONGO DB</p>
          </div>
          <div className="shadow-md shadow-[#040c16] hover:scale-110 duration-300">
            <img className="w-20 mx-auto" src={github} alt="GITHUB" />
            <p className="my-4">GITHUB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
