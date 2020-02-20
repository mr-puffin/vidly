import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getGenres } from "../services/genreService";
import { getMovies, deleteMovie } from "../services/movieService";
import Pagination, { paginate } from "./common/pagination";
import ListGroup from "./common/listGroup";
import MoviesTable from "./moviesTable";
import SearchBox from "./common/searchBox";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: { path: "title", order: "asc" },
    searchQuery: "",
    selectedGenre: null
  };

  async componentDidMount() {
    const genres = await getGenres();
    const movies = await getMovies();
    this.setState({
      movies,
      genres: [{ name: "All Genre" }, ...genres]
    });
  }

  handleLike = movie => {
    const movies = this.state.movies.map(m => {
      if (m._id === movie._id) m.liked = !m.liked;
      return m;
    });
    this.setState({ movies });
  };

  handleDelete = async movie => {
    let originalMovies = this.state.movies;

    let { currentPage, pageSize } = this.state;
    let movies = originalMovies.filter(m => m._id !== movie._id);
    let startIndex = (currentPage - 1) * pageSize;
    if (startIndex >= movies.length) currentPage--;
    this.setState({ movies, currentPage });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This movie has already deleted");
      }
      this.setState({ movies: originalMovies });
    }
  };

  handlePageChange = p => {
    if (p === this.state.currentPage) return;
    let currentPage = p;
    this.setState({ currentPage });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  getPagedData = () => {
    const {
      movies: allMovies,
      currentPage,
      pageSize,
      selectedGenre,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id) {
      filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);
    }
    let sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    let movies = paginate(sorted, currentPage, pageSize);
    return { count: filtered.length, data: movies };
  };

  render() {
    const { length: totalCount } = this.state.movies;
    const { user } = this.props;

    const {
      currentPage,
      pageSize,
      genres,
      selectedGenre,
      sortColumn,
      searchQuery
    } = this.state;

    if (totalCount === 0) return <p>There are no movies in the database.</p>;

    const { count, data: movies } = this.getPagedData();

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-3">
            <ListGroup
              items={genres}
              selectedItem={selectedGenre}
              onItemSelect={this.handleGenreSelect}
            />
          </div>
          <div className="col">
            {user && (
              <Link
                to="/movies/new"
                className="btn btn-primary"
                style={{ marginBottom: 20 }}
              >
                New Movie
              </Link>
            )}
            <p>Showing {count} movies in the database.</p>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <MoviesTable
              movies={movies}
              sortColumn={sortColumn}
              onLike={this.handleLike}
              onDelete={this.handleDelete}
              onSort={this.handleSort}
            />
            <Pagination
              pageSize={pageSize}
              itemCount={count}
              onPageChange={this.handlePageChange}
              currentPage={currentPage}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Movies;
