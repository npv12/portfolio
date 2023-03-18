import React from 'react'
import "../../index.scss";
import "./project.scss";
import img1 from "./flipkart1.jpg";
import img2 from "./flipkart2.jpg";
import YouTubeTest from "../youtube/YouTubeTest"
import FadeIn from '../FadeIn/FadeIn';
function Project() {
    return (
        <div className='start'>
            <div className='text'>
                <h1>Flipkart GRiD 3.0</h1>
            </div>
            <div className="grid">
                
                <FadeIn>
                <div className="grid-item">
                    <img className='image-style' src={img1}></img>
                </div>
                </FadeIn>
                <FadeIn>
                <div className="grid-item">
                    <div className='subText'>
                        <ul className="list">
                            <li>List item 1</li>
                            <li>List item 2</li>
                            <li>List item 3</li>
                        </ul>
                    </div>
                </div>
                </FadeIn>
                <FadeIn>
                <div className="grid-item">
                    <div className='subText'>
                        <ul className="list">
                            <li>List item 1</li>
                            <li>List item 2</li>
                            <li>List item 3</li>
                        </ul>
                    </div>
                </div>
                </FadeIn>
                <FadeIn>
                <div className="grid-item">
                    <YouTubeTest YTlink="p6G3ub3R7Qo" />
                </div>
                </FadeIn>
                <FadeIn>
                <div className="grid-item">
                    <YouTubeTest YTlink="WYtzD95BN-g" />
                </div>
                </FadeIn>
                <FadeIn>
                <div className="grid-item">Item 5</div>
                </FadeIn>
            </div>
        </div>
    )
}

export default Project
            // <div className="row">
            //     <div className="col-sm">

            //         <div className='subText'>
            //             I apologize if I am not meeting your expectations in terms of speed. As an AI language model, I do not have a boyfriend or a premium plan. My goal is to provide accurate and helpful responses to your questions to the best of my ability. Please let me know how I can better assist you.
            //         </div>
            //     </div>
            //     <div className="col-sm">
            //         <div className='subText'>
            //             I apologize if I am not meeting your expectations in terms of speed. As an AI language model, I do not have a boyfriend or a premium plan. My goal is to provide accurate and helpful responses to your questions to the best of my ability. Please let me know how I can better assist you.
            //         </div>

            //     </div>
            // </div>