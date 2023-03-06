import TagSphere from "../../components/tagSphere/TagSphere";
import "../../text.scss";
import "./about.scss";

const About = () => {
  return (
    <>
      <p className="text">About</p>
      <div className="about-container">
        <div className="about-container-info">
          <p className="subText">
            Hi, I'm Nedungadi Pranav V (a.k.a. npv12)!
            <br />
            <br /> I'm currently a college student pursuing a integrated dual
            degree course in Mechanical engineering. <br />
            <br />
            I'm a hardworking and dedicated college student with a strong
            passion for computer science and robotics, and I'm looking forward
            to a successful career in this exciting and constantly evolving
            industry. I am also an ardent lover of open source and building
            excellent web application that improve the lives of those around me.
            <br />
            <br />
            In my free time, I enjoy learning about new technologies and
            programming languages and build website projects that can train me
            to be proficient in the field of web development, as well as staying
            up to date with the latest trends in the field.
          </p>
        </div>
        <TagSphere />
      </div>
    </>
  );
};

export default About;
