import React from 'react'
import { Col1, Col2, Row, Styled } from './styled'
import { FaFacebook, FaGithub, FaLinkedin, FaPhoneAlt, FaUser, FaYoutube } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import IndianFlag from '../../components/IndianFlag'
import { TbWorldWww } from 'react-icons/tb'

const Home = () => {


    return (
        <>
            <Styled.Wrapper>
                <h3>ReactJS Notes - last updated: Sep 19, 2025</h3>

                <fieldset>
                    <legend>About Project</legend>
                    <div className='para'>
                        <h2 className='heading'>From Wikipedia, the free encyclopedia</h2>
                        <p>
                            React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library that aims to make building user interfaces based on components more "seamless". It is maintained by Meta (formerly Facebook) and a community of individual developers and companies.
                        </p>
                        <p>
                            React can be used to develop single-page, mobile, or server-rendered applications with frameworks like Next.js and Remix. Because React is only concerned with the user interface and rendering components to the DOM, React applications often rely on libraries for routing and other client-side functionality. A key advantage of React is that it only re-renders those parts of the page that have changed, avoiding unnecessary re-rendering of unchanged DOM elements.
                        </p>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>About Developer</legend>
                    <div className='aboutDeveloper'>
                        <Row>
                            <Col1>Name</Col1>
                            <Col2>
                                Ashish Ranjan
                                <div className="icon"><FaUser size={20} /></div>
                            </Col2>
                        </Row>
                        <Row>
                            <Col1>Phone</Col1>
                            <Col2>
                                <a
                                    href="tel:+918123747965"
                                >+91 8123747965</a>
                                <div className="icon"><FaPhoneAlt size={20} /></div>
                            </Col2>
                        </Row>
                        <Row>
                            <Col1>Email</Col1>
                            <Col2>
                                <a
                                    href="mailto:ash.ranjan09@gmail.com"
                                >ash.ranjan09@gmail.com</a>
                                <div className="icon"><MdEmail size={20} /></div>
                            </Col2>
                        </Row>
                        <Row>
                            <Col1>Nationality</Col1>
                            <Col2>
                                The Republic of India
                                <div className="icon"><IndianFlag /></div>
                            </Col2>
                        </Row>
                        <Row>
                            <Col1>Website</Col1>
                            <Col2>
                                <a
                                    href="https://www.ashishranjan.net/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >https://www.ashishranjan.net/</a>
                                <div className="icon"><TbWorldWww size={20} /></div>
                            </Col2>
                        </Row>
                        <Row>
                            <Col1>Old Website</Col1>
                            <Col2>
                                <a
                                    href="http://www.ashishranjan.in/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >http://www.ashishranjan.in/</a>
                                <div className="icon"><TbWorldWww size={20} /></div>
                            </Col2>
                        </Row>
                        <Row>
                            <Col1>Facebook</Col1>
                            <Col2>
                                <a
                                    href="https://www.facebook.com/theash.ashish/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >https://www.facebook.com/theash.ashish/</a>
                                <div className="icon"><FaFacebook size={20} /></div>
                            </Col2>
                        </Row>
                        <Row>
                            <Col1>LinkedIn</Col1>
                            <Col2>
                                <a
                                    href="https://www.linkedin.com/in/aashishranjan/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >https://www.linkedin.com/in/aashishranjan/</a>
                                <div className="icon"><FaLinkedin size={20} /></div>
                            </Col2>
                        </Row>
                        <Row>
                            <Col1>YouTube</Col1>
                            <Col2>
                                <a
                                    href="https://www.youtube.com/channel/UCLHIBQeFQIxmRveVAjLvlbQ"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >https://www.youtube.com/channel/UCLHIBQeFQIxmRveVAjLvlbQ</a>
                                <div className="icon"><FaYoutube size={20} /></div>
                            </Col2>
                        </Row>
                        <Row>
                            <Col1>GitHub</Col1>
                            <Col2>
                                <a
                                    href="https://github.com/a2rp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >https://github.com/a2rp</a>
                                <div className="icon"><FaGithub size={20} /></div>
                            </Col2>
                        </Row>
                    </div>
                </fieldset>
            </Styled.Wrapper>
        </>
    )
}

export default Home

