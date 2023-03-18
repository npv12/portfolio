import React from 'react'
import headImage from './images/titleImage.jpg'
import botImage from './images/botImage.jpg'
import YouTubeTest from '../../youtube/YouTubeTest'
import FadeIn from '../../FadeIn/FadeIn'
import './Flipkart.scss'
function Flipkart() {
    return (
        <div className='start'>
            <div className='text'>
                <h1>Flipkart GRiD 3.0</h1>
                <YouTubeTest YTlink="iZGUXmR9zIY"/>
                {/* <h2> upload video of side camera and add link</h2> */}
            </div>

            <div className='grid'>
                {/* row1 */}
                <FadeIn>
                <div className='gird-item'>
                    <img className='image-style' src={botImage}></img>
                </div>
                <div className='gird-item'>
                    <div className='subText'>
                        <ul className='list'>
                            <li>Bot description1</li>
                            <li>Bot description2</li>
                            <li>Bot description3</li>
                        </ul>
                    </div>
                </div>
                </FadeIn>
                {/* row2 */}
                <FadeIn>

                <div className='grid-item'>
                    <div className='subText'>
                        <ul className='list'>
                        <li>Working of stage detection1</li>
                        <li>Working of stage detection3</li>
                        <li>Working of stage detection2</li>
                        </ul>
                    </div>
                </div>
                <div className='grid-item'>
                    <YouTubeTest YTlink="5Ej_vqSPSwY"/>
                </div>
                </FadeIn>
                {/* row3 */}
                <FadeIn>
                <div className='grid-item'>
                    <YouTubeTest YTlink="WYtzD95BN-g"/>
                </div>
                <div className='grid-item'>
                    <div className='subText'>
                        <ul className='list'>
                        <li>Working of bot detection1</li>
                        <li>Working of bot detection2</li>
                        <li>Working of bot detection3</li>
                        </ul>
                    </div>
                </div>
                </FadeIn>

                {/* row4 */}
                <FadeIn>
                <div className='grid-item'>
                    <div className='subText'>
                        <ul className='list'>
                            <li>working of djkstra algo</li>
                            <li>ROS implementation</li>
                            <li>RViZ</li>
                        </ul>
                    </div>
                </div>
                <div className='grid-item'>
                    <YouTubeTest YTlink="p6G3ub3R7Qo"></YouTubeTest>
                </div>
                </FadeIn>
            </div>
        </div>
    )
}

export default Flipkart