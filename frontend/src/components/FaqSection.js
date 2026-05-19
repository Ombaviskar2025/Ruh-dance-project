import React, { useState } from 'react';
import './FaqSection.css';
import { LuPlus } from 'react-icons/lu';

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What types of dance classes do you offer?",
      answer: "We offer a diverse range of styles including Semi-Classical, Ballet, Bollywood, Hip-Hop, and Contemporary. We also specialize in Dance Movement Therapy (DMT) for emotional and mental well-being."
    },
    {
      question: "What are the fees and payment structures?",
      answer: "Our fees vary depending on the chosen dance style and the duration of the course. We offer flexible monthly and quarterly packages. For specific pricing, please reach out via our Inquiry Form or contact our studio directly."
    },
    {
      question: "Do you provide opportunities for stage performances?",
      answer: "Absolutely! We believe the stage is where the soul speaks. We organize major annual productions and regular showcase events where every student gets the opportunity to perform professionally."
    },
    {
      question: "How do I participate in Dance Movement Therapy (DMT)?",
      answer: "DMT sessions can be booked directly through the Student Dashboard once you are registered. We offer both group workshops and personalized one-on-one sessions focused on healing."
    },
    {
      question: "How do I register or join?",
      answer: "You can click the 'Join Now' button on our homepage to submit an inquiry, or create an account directly through the 'Sign In' portal. Once registered, you will get access to the Student Dashboard."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-wrapper fade-in scroll-reveal">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleAccordion(index)}
          >
            <div className="faq-question">
              {faq.question}
              <span className="faq-icon"><LuPlus /></span>
            </div>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
