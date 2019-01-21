import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'proptypes';
import DatePicker from './DatePicker';
import './styles.scss';

class Filter extends PureComponent {
  constructor() {
    super();
    this.state = {
      filterOptionsIsVisible: false,
      selectedFilters: [],
      filterSet: '',
    };
  }

  componentDidMount() {
    const { filterSet } = this.props;
    this.setState({
      filterSet,
    });
  }

  toggleVisibility = () => {
    const { filterOptionsIsVisible } = this.state;
    this.setState({ filterOptionsIsVisible: !filterOptionsIsVisible });
  }

  selectCheckBoxFilter = (event) => {
    const { selectedFilters, filterSet } = this.state;
    const { handleFilterChange } = this.props;
    const filter = event.target.value;
    if (selectedFilters.includes(filter)) {
      const selectedFiltersToMutate = [...selectedFilters];
      selectedFiltersToMutate.splice(selectedFilters.indexOf(filter), 1);
      this.setState({
        selectedFilters: selectedFiltersToMutate,
      });
      handleFilterChange(filter, filterSet, 'remove_filter');
    } else {
      this.setState({
        selectedFilters: [...selectedFilters, event.target.value],
      });
      handleFilterChange(filter, filterSet, 'add_filter');
    }
  }

  selectDateFilter = (date, datePickerID) => {
    const { handleFilterChange } = this.props;
    const { filterSet } = this.state;
    if (datePickerID === `${1}`) {
      handleFilterChange(date, filterSet, 'set_from_date');
    } else if (datePickerID === `${2}`) {
      handleFilterChange(date, filterSet, 'set_to_date');
    }
  }

  selectFilterOption(option) {
    switch (option.type) {
      case 'checkbox':
        return this.renderCheckBoxOption(option);
      case 'date':
        return this.renderDateOption(option);
      default:
        return null;
    }
  }

  renderCheckBoxOption(option) {
    return (
      <li key={option.id}>
        <input type="checkbox" value={option.value} onChange={this.selectCheckBoxFilter} />
        <span>{option.text}</span>
      </li>
    );
  }

  renderDateOption(option) {
    return (
      <li key={option.id}>
        <DatePicker
          id={`${option.id}`}
          handleChange={this.selectDateFilter}
          placeholderText={option.text}
        />
      </li>
    );
  }


  renderFilterOptions() {
    const { options } = this.props;
    const { filterOptionsIsVisible } = this.state;
    return (
      <ul
        className={classNames('filter-options', { 'filter-options-isvisible': filterOptionsIsVisible })}
      >
        {options.map(option => (this.selectFilterOption(option)))}
      </ul>
    );
  }

  render() {
    const { title } = this.props;
    const { filterOptionsIsVisible } = this.state;
    return (
      <div className="filter">
        <div className="filter-title" onClick={this.toggleVisibility}>
          <span className="title">{title}</span>
          <i
            className={classNames('fa fa-angle-down', { 'rotate-180': filterOptionsIsVisible })}
          />
        </div>
        {this.renderFilterOptions()}
      </div>
    );
  }
}

Filter.propTypes = {
  filterSet: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
};

export default Filter;
