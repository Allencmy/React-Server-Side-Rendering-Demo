import React from 'react';
import { get, } from '../../utils/axios';

import MovieCard from './movieCard/index';

export default class Movie extends React.Component {

  static fetchData() {
    return get('/api/movies')
      .then(response => response.data.subjects)
      .catch((err) => {
        console.error('err', err);
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      movies: (props.staticContext && props.staticContext.data) ?
        props.staticContext.data : (props.preloadData ? props.preloadData : []),
    };
  }
  componentDidMount() {
    get('/api/movies')
      .then((response) => {
        this.setState({
          movies: response.data.subjects || [],
        });
      });
  }


  render() {
    const { movies, } = this.state;
    const movieList = !!movies && movies.map(m => <MovieCard key={m.title} movie={m}/>);
    return (
      <div>
        <h1>Movie</h1>
        {movieList}
      </div>
    );
  }
}
