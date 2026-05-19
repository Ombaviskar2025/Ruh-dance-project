import React from 'react';
import './ComparisonSection.css';
import { LuCheck, LuX } from 'react-icons/lu';

const ComparisonSection = () => {
  const features = [
    { name: "Professional Industry Trainers", ruh: true, other: false },
    { name: "Live Stage Performances", ruh: true, other: false },
    { name: "Dance Movement Therapy (DMT)", ruh: true, other: false },
    { name: "Flexible Timings", ruh: true, other: true },
    { name: "Personalized Attention", ruh: true, other: false },
    { name: "Certified Programs", ruh: true, other: false }
  ];

  return (
    <section className="comparison-wrapper fade-in">
      <h2 className="comparison-title">Why Choose <span>Ruh Dance</span>?</h2>
      <p className="comparison-subtitle">See how our holistic approach to dance education stands out from the rest.</p>
      
      <div className="comparison-table-container hover-3d-card">
        <div className="comparison-row comparison-header">
          <div className="comparison-cell col-feature">Features</div>
          <div className="comparison-cell col-other">Other Academies</div>
          <div className="comparison-cell col-ruh">Ruh Dance Academy</div>
        </div>
        
        {features.map((item, index) => (
          <div className="comparison-row" key={index}>
            <div className="comparison-cell col-feature">{item.name}</div>
            <div className="comparison-cell col-other">
              {item.other ? <LuCheck className="icon-check" style={{color: 'rgba(255,255,255,0.4)'}} /> : <LuX className="icon-cross" />}
            </div>
            <div className="comparison-cell col-ruh">
              {item.ruh ? <LuCheck className="icon-check" /> : <LuX className="icon-cross" />}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComparisonSection;
