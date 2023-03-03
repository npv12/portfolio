const About = () => {
  return (
    <div id="about" className="w-full h-screen bg-[#0a192f] text-gray-300">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="max-w-[1000px] w-full grid grid-cols-2 gap-8">
          <div className="sm:text-right pb-8 pl-4">
            <p className="text-4xl font-bold border-b-4 border-pink-600 inline">
              about
            </p>
          </div>
          <div></div>
        </div>
        <div className="max-w-[1000px] w-full grid sm:grid-cols-2 gap-8 px-4">
          <div className="sm:text-right text-4xl">
            <p>Hi, I'm Pranav Nice to meet you. Please take a look around</p>
          </div>
          <div>
            <p>
              I'm passoniate about building excellent web application that
              improve the lives of those around me. I specialize in creating
              software for clients ranging from individual and small-business an
              all the way to large enterprise corporations. What would you do if
              you had a web front end developer available at your fingertips?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
