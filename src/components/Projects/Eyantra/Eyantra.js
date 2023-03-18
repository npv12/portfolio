import React from 'react'
import YouTubeTest from '../../youtube/YouTubeTest'
import FadeIn from '../../FadeIn/FadeIn'
import './Eyantra.scss'
function Eyantra() {
    return (
        <div className='start'>
            <div className='text'>
                <h1>Autonomous Self Balancing Bike </h1>
                {/* <YouTubeTest YTlink="WYtzD95BN-g" /> */}
                <h2> Add final video</h2>
            </div>
            <ul className='list'>
                <li>About Solidworkd and coppleiasim</li>
                <li>About Solidworkd and coppleiasim</li>
                <li>About Solidworkd and coppleiasim</li>
            </ul>


            <div className='grid'>
                {/* row1 */}
                <div className='gird-item'>
                    <h1>Stanley Algo</h1>
                    {/* <img className='image-style' src={botImage}></img> */}
                </div>
                <div className='gird-item'>
                    <div className='subText'>
                        <ul className='list'>
                            <li>Stanley Algo</li>
                            <li>Stanley Algo</li>
                            <li>Stanley Algo</li>
                        </ul>
                    </div>
                </div>
                {/* row2 */}
                <div className='grid-item'>
                    <div className='subText'>
                        <ul className='list'>
                            <li>LRQ controller</li>
                            <li>LRQ controller</li>
                            <li>LRQ controller</li>
                        </ul>
                    </div>
                </div>
                <div className='grid-item'>
                    <h1>add image form pdf</h1>
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
                                <li>Brag about IK controller</li>
                                <li>Brag about IK controller</li>
                                <li>Brag about IK controller</li>
                            </ul>
                        </div>
                    </div>
                </FadeIn>

            </div>
        </div>
    )
}

export default Eyantra