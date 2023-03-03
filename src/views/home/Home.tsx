import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const Home = () => {
  return (
    <div id="home" className="w-full h-screen bg-[#0a192f]">
      {/* container */}
      <div className="max-w-[1000px] flex justify-center mx-auto px-8 flex-col h-full">
        <p className="text-pink-600">Hi, My name is</p>
        <h1 className="text-4xl sm:text-7xl text-[#ccd6f6] font-bold">
          Nedungadi Pranav V
        </h1>
        <h2 className="text-4xl text-[#8892b0] font-bold sm:text-7xl">
          I'm a Front end developer
        </h2>
        <p className="text-[#8892b0] py-4 max-w-[700px] text-xl">
          As a front-end developer, I try to play a crucial role in the creation
          of modern web applications. My primary responsibility is to build the
          user-facing portion of a website or web application using HTML, CSS,
          JavaScript, React, and Tailwind css. This includes creating visually
          appealing and responsive user interfaces, optimizing web pages for
          speed and performance, and ensuring compatibility across different
          browsers and devices.
        </p>
        <div>
          <button className="group flex text-white items-center gap-2 px-5 py-3 border-2 hover:bg-pink-600 hover:border-pink-600" onClick={() => {
            
          }}>
            View Work
            <span className="ml-1 text-xl group-hover:rotate-90 duration-500">
              <HiOutlineArrowNarrowRight />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
