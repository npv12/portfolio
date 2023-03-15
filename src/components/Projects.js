import React, { useEffect, useState } from "react";
import "./styles.css";
function Projects() {
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
            <div className="text" style={{ paddingBottom: '40px' }}>
                <p>
                    Projects
                </p>
            </div>

            {/* <div className="subText">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div> */}

        </div>
    );
}

export default Projects