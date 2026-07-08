import React from 'react';

const AboutUs = () => {
  return (
    <section className="intro-section">
      <h2>What Our Customers Say</h2>
      <div className="reviews">
        <blockquote>
          "When we started planning my daughter’s wedding, we were overwhelmed with choices and didn’t know where to begin. A friend recommended GU Event Planner, and it was the best decision we made. From the very first meeting, their team understood our vision and respected our traditions. The mehendi, sangeet, and the main ceremony were each handled with such grace, precision, and creativity. Every detail—from the mandap décor to the guest welcome hampers—was beautifully curated. Our relatives from across India still talk about how well-organized and magical the event was. GU Event Planner truly made it a once-in-a-lifetime experience for our family."
          — Mr. R. Sharma, Guwahati.
        </blockquote>
        <blockquote>
          "As an HR manager of a mid-sized tech firm in Assam, I was tasked with organizing our company’s 10-year anniversary celebration. I was honestly nervous, as expectations were high and we wanted something elegant but not over-the-top. GU Event Planner exceeded every expectation. They handled venue selection, stage design, lighting, catering, and even a live performance by a local artist. Their professionalism and attention to detail were unmatched. Not only was the event seamless, but our CEO personally complimented the coordination and overall vibe. I can confidently say we’ll be working with them again for future events."
          — P. Das, HR Executive, Guwahati.
        </blockquote>
        <blockquote>
          "Our group of friends wanted to celebrate a milestone birthday with a destination party in Shillong, and GU Event Planner was recommended by someone local. I have to say—we were blown away. They arranged travel, hotel bookings, event permissions, and a beautiful lakeside party with local cuisine, live music, and bonfire seating. It was like something out of a film. They coordinated everything remotely and still managed to make us feel personally attended to at every step. I couldn’t have imagined a more special way to celebrate, and I would trust them with any future event, big or small."
          — Ankita M., Bangalore (hosted event in Shillong).
        </blockquote>
      </div>

      <div className="features">
        <h2>Project Members</h2>
        <ul>
          <li>Guide - Prof. Kishore Kumar Kashyap</li>
          <li>Member 1 - Dipam Barman</li>
          <li>Member 2 - Abhijit Talukdar</li>
          {/* Add more members as needed */}
        </ul>
      </div>
    </section>
  );
};

export default AboutUs;
