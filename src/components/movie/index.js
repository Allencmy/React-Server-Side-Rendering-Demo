import React from 'react';
import { get, axios, } from '../../utils/axios';

import MovieCard from './movieCard/index';

export default class Movie extends React.Component {

    constructor(props) {
      super(props);
     console.log('Movie props', props.data.length);
      this.state = {
        // movies: [],
        movies: this.props.data || [],
      }
    }

    static fetchData() {
      return get('/api/movies')
      .then(response => response.data.subjects)
      .catch((err) => {
        console.error('err', err);
      })
    }

    componentWillMount() {

    }

    componentDidMount() {
      // console.log('Movie componentDidMount this.props', this.props);
      // if (this.props.data) return;
      get('/api/movies')
      .then(response => {
          this.setState({
            movies: response.data.subjects || [],
          })
      });
    }


  render() {
    const { movies, } = this.state;
    const _movieList = !!movies && movies.map(m => <MovieCard key={m.title} movie={m}/>);
    return (
      <div>
        <h1>Movie</h1>
        {_movieList}
      </div>
    )
  }
}
