import React from 'react';
import './about.css';

function About() {
  return (
    <div class="about-container">
        <div class="about-box title">About</div>
        <div class="about-box company-desc">
            Nano Dimension Ltd. engages in the provision of intelligent machines for the fabrication of additively manufactured electronics. Its products include DragonFly IV, AME Materials, Fabrica 2.0, Fabrica Micro-AM Materials, Essemtec SMT Equipment and Global Inkjet System. <a href="#">Show more</a>
        </div>
        <div class="about-box company-stats">
            <div>
                <strong>CEO</strong>
                <span>Yoav Stern</span>
            </div>
            <div>
                <strong>Employees</strong>
                <span>509</span>
            </div>
            <div>
                <strong>Headquarters</strong>
                <span>Ness Ziona, HaDarom</span>
            </div>
            <div>
                <strong>Founded</strong>
                <span>2012</span>
            </div>
        </div>
    </div>

  );
}

export default About;
