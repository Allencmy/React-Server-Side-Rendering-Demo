import React from 'react';
// import './style.less'

const MovieCard = ({ movie, }) => {
  const { cover, title, rate, } = movie;
  return (
    <div className="movie-card">
      <img src={cover}/>
      <div>
        <h3>{title}</h3>
        <p>{rate}</p>
      </div>
    </div>
  );
}

export default MovieCard;
