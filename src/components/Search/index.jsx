
import React, { PureComponent } from 'react';
import PropTypes from 'proptypes';
import './styles.scss';
import classNames from 'classnames';

class Search extends PureComponent {
  constructor() {
    super();
    this.state = {
      searchOptionsVisible: false,
      searchValue: '',
      searchCriteria: 1,
    };
  }

  componentDidUpdate() {
    const { searchValue, searchCriteria } = this.state;
    const { handleSearch } = this.props;
    if (searchValue || searchCriteria) {
      handleSearch(searchValue, searchCriteria);
    }
  }

  toggleVisibility = () => {
    this.setState(prevState => ({
      searchOptionsVisible: !prevState.searchOptionsVisible,
    }));
  };

  handleSearchCriteriaChange = (optionId) => {
    this.setState({
      searchCriteria: optionId,
    });
  };

  handleSearchValueChange = (event) => {
    event.preventDefault();
    this.setState({ searchValue: event.target.value });
  }

  renderSearchOptions() {
    const { searchOptionsVisible } = this.state;
    return (
      <ul className={classNames('search-option', { 'search-options-isvisible': searchOptionsVisible })}>
        <li>
          <input type="radio" defaultChecked name="search" onChange={() => this.handleSearchCriteriaChange(1)} />
          {'Fellow Name'}
        </li>
        <li>
          <input type="radio" name="search" onChange={() => this.handleSearchCriteriaChange(2)} />
          {'Partner Name'}
        </li>
      </ul>
    );
  }

  render() {
    const { searchValue } = this.state;
    const { searchOptionsVisible, searchCriteria } = this.state;
    return (
      <div>
        <input type="text" className="search-input" value={searchValue} onChange={this.handleSearchValueChange} />
        <div className="search">
          <div className="search-title" onClick={event => this.toggleVisibility(event)}>
            <span className="title">
              {'Search With'}
              {' | '}
              {searchCriteria === 1 ? 'Fellow Name' : 'Partner Name'}
            </span>

            <i
              className={classNames('fa fa-angle-down', { 'rotate-180': searchOptionsVisible })}
            />
          </div>
          {this.renderSearchOptions()}
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  handleSearch: PropTypes.func.isRequired,
};

export default Search;
