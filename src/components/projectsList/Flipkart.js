import React, { useEffect, useState } from "react";
import "../styles.css";
import flipkartImg from './flipkart.jpg'



function Flipkart() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= documentHeight) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className={`slide-in-text ${isVisible ? "is-visible" : ""}`}>
            <div className="subTitleText" style={{ paddingBottom: '40px' }}>
                <p>
                    Flipkart
                </p>
            </div>

            <div className="subText">

                <div class="row" >
                    <div class="col-4" >

<ul class="list-group" >
  <li class="list-group-item">Developed a system of 4 autonomous robots for warehouse navigation purpose using ROS environment, Arduino, and RF module for communication.
  </li>
  <li class="list-group-item">Implemented image processing usingOpenCV to extract robots location and orientation from live video feed of arena captured by an overhead
camera in a main system running ROS.
</li>
  <li class="list-group-item">• Utilized Dijkstra algorithm to generate a path for robots movement, and transmitted the robots velocity vector to an Arduino via serial com
munication and RF module to control their movement. 
</li>
</ul>                       
                    </div>
                    <div class="col-8" >
                        <img src={flipkartImg} style={{ position: 'absolute', right: '20px' }}></img>

                    </div>
                </div>

            </div>


        </div>
    );
}

export default Flipkart