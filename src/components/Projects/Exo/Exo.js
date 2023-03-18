import React from 'react'
import YouTubeTest from '../../youtube/YouTubeTest'
import FadeIn from '../../FadeIn/FadeIn'
import './Exo.scss'
function Exo() {
    return (
        <div className='start'>
            <div className='text'>
                <h1>Lower Limb Exoskeleton</h1>
                {/* Show image only */}
                <h2> Show image only</h2>
            </div>

            <div className='grid'>
                {/* row1 */}
                <div className='gird-item'>
                    {/* add image of circut */}
                    {/* <img className='image-style' src={botImage}></img> */}
                </div>
                <div className='gird-item'>
                    <div className='subText'>
                        <ul className='list'>
                            <li>Circuit description1</li>
                            <li>Circuit description2</li>
                            <li>Circuit description3</li>
                        </ul>
                    </div>
                </div>
                {/* row2 */}
                <div className='grid-item'>
                    <div className='subText'>
                        <ul className='list'>
                        <li>ROS archiceture for wired</li>
                        <li>ROS archiceture for wired</li>
                        <li>ROS archiceture for wired</li>
                        </ul>
                    </div>
                </div>
                <div className='grid-item'>
                    {/* add image of archiceture */}
                    {/* <img className='image-style' src={botImage}></img> */}
                </div>

                {/* row3 */}
                <FadeIn>
                <div className='grid-item'>
                    {/* add image of archiceture */}
                    {/* <img className='image-style' src={botImage}></img> */}
                    </div>
                <div className='grid-item'>
                    <div className='subText'>
                        <ul className='list'>
                        <li>ROS archiceture for wireless</li>
                        <li>ROS archiceture for wireless</li>
                        <li>ROS archiceture for wireless</li>
                        </ul>
                    </div>
                </div>
                </FadeIn>

            </div>
        </div>
    )
}

export default Exo