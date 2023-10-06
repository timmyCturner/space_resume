import React, { Component } from 'react';

class Videos extends Component {
  render() {



    return (
      <section id="videos">

      <h1>Non Hosted Projects</h1>
      <div className="row flex-row flex-2-column">





      <div id="portfolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf videos-wrap">
      <a href="https://www.youtube.com/watch?v=KjdNxq2WNhU" target="_blank" rel="noopener noreferrer">
      <img src = "http://img.youtube.com/vi/KjdNxq2WNhU/1.jpg"></img>
      </a>
      </div>

      <div id="portfolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf videos-wrap">
      <a href="https://www.youtube.com/watch?v=KmLISdTJqfk" target="_blank" rel="noopener noreferrer">
      <img src = "http://img.youtube.com/vi/KmLISdTJqfk/1.jpg"></img>
      </a>
      </div>

      <div id="portfolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf videos-wrap">
      <a href="https://www.youtube.com/watch?v=0zUPC9MxD3g" target="_blank" rel="noopener noreferrer">
      <img src = "http://img.youtube.com/vi/0zUPC9MxD3g/3.jpg"></img>
      </a>
      </div>

      <div id="portfolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf videos-wrap last">
      <a href="https://www.youtube.com/watch?v=I-c9k389KtA" target="_blank" rel="noopener noreferrer">
      <img src = "http://img.youtube.com/vi/I-c9k389KtA/1.jpg"></img>
      </a>
      </div>


        </div>
        <a href = "https://www.underdognexus.com/videos-pg/" className = "btn link button">More Videos &amp; Source Code</a>

   </section>
    );
  }
}

export default Videos;
