import React from 'react';
import { get, axios, } from '../../utils/axios';

import MovieCard from './movieCard/index';

export default class Movie extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        movies: [],
      }
    }

    static fetchData() {
      return get('/api/movies')
      .then(response => response.data.subjects);
    }

    componentDidMount() {
      get('/api/movies')
      .then(response => {
          this.setState({
            movies: response.data.subjects || [],
          })
      });
    }


  render() {
    const { movies, } = this.state;
    const _movieList = !!movies && movies.map((m) => {
      return <MovieCard key={m.title} movie={m}/>;
    })
    console.log('_movieList', _movieList);
    return (
      <div>
        <h1>Movie</h1>
        {_movieList}
      </div>
    )
  }
}
