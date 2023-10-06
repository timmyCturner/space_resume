import React, { Component } from 'react';

class AnionCreative extends Component {
  render() {

    if(this.props.data){
      console.log(this.props.data);
      var projects = this.props.data.projects.map(function(projects){
        //var projectImage = './images/portfolio/'+projects.image;
        return <div key={projects.title} className="columns portfolio-item">
           <div className="item-wrap">
            <a href={projects.url} title={projects.title}>
               <img alt={projects.title} src={require('./images/portfolio/'+projects.image)} />
               <div className="overlay">
                  <div className="portfolio-item-meta">
                 <h5>{projects.title}</h5>
                     <p>{projects.category}</p>
                  </div>
                </div>
              <div className="link-icon"><i className="fa fa-link"></i></div>
            </a>
          </div>


        </div>
      })
    }

    return (
      <section id="anion">

      <div className="row">

         <div className="twelve columns collapsed">

            <h1>Websites Built with AnionCreative</h1>

            <div id="portfolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf">
                {projects}
            </div>
          </div>
      </div>
   </section>
    );
  }
}

export default AnionCreative;
