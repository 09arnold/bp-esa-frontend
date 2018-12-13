/* eslint-disable no-return-assign */
/* eslint-disable no-fallthrough */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';
import Filter from '../Filter';
import Search from '../Search';
import * as constants from '../constants';
import mockReport from '../../mocks/mockReport';
import FiltersBar from '../FiltersBar';
import './styles.scss';
import AutomationDetails from '../AutomationDetails';


/* eslint-disable class-methods-use-this */
class ReportPage extends PureComponent {
  constructor() {
    super();
    this.state = {
      reportData: mockReport,
      filters: {
        automationStatus: [],
        automationType: [],
        date: { from: '', to: '' },
        length: 0,
        updated: false,
      },
      searchResult: false,
      filteredReport: [],
      isModalOpen: false,
      modalContent: {},
      type: '',
    };
  }

  componentDidUpdate() {
    const { filters } = this.state;
    if (filters.updated) {
      this.filterReports();
    }
  }

  setFilter = (filter, filterSet, action) => {
    const { filters: previousFilters, filters: { length } } = this.state;
    if (action === 'add_filter' && filterSet === 'automationStatus') {
      this.setState({
        filters: {
          ...previousFilters,
          automationStatus: [
            ...previousFilters.automationStatus,
            filter,
          ],
          length: length + 1,
          updated: true,
        },
      });
    } else if (action === 'remove_filter' && filterSet === 'automationStatus') {
      const filterToMutate = [...previousFilters.automationStatus];
      filterToMutate.splice(filterToMutate.indexOf(filter), 1);
      this.setState({
        filters: {
          ...previousFilters,
          automationStatus: filterToMutate,
          length: length - 1,
          updated: true,
        },
      });
    } else if (action === 'add_filter' && filterSet === 'automationType') {
      this.setState({
        filters: {
          ...previousFilters,
          automationType: [
            ...previousFilters.automationType,
            filter,
          ],
          length: length + 1,
          updated: true,
        },
      });
    } else if (action === 'remove_filter' && filterSet === 'automationType') {
      const filterToMutate = [...previousFilters.automationType];
      filterToMutate.splice(filterToMutate.indexOf(filter), 1);
      this.setState({
        filters: {
          ...previousFilters,
          automationType: filterToMutate,
          length: length - 1,
          updated: true,
        },
      });
    } else if (action === 'set_from_date' && filterSet === 'date') {
      let newLength = length;
      if (filter && !previousFilters.date.from) {
        newLength = length + 1;
      } else if (!filter && previousFilters.date.from) {
        newLength = length - 1;
      }
      this.setState({
        filters: {
          ...previousFilters,
          date: {
            ...previousFilters.date,
            from: filter,
          },
          length: newLength,
          updated: true,
        },
      });
    } else if (action === 'set_to_date' && filterSet === 'date') {
      let newLength = length;
      if (filter && !previousFilters.date.to) {
        newLength = length + 1;
      } else if (!filter && previousFilters.date.to) {
        newLength = length - 1;
      }
      this.setState({
        filters: {
          ...previousFilters,
          date: {
            ...previousFilters.date,
            to: filter,
          },
          length: newLength,
          updated: true,
        },
      });
    }
  }

  doSearch = (searchValue, optionId) => {
    const { reportData } = this.state;

    let filteredReport = null;

    const searchCriteria = optionId === 1 ? 'fellowName' : 'partnerName';

    if (searchValue) {
      filteredReport = reportData.filter(
        report => report[searchCriteria].toLowerCase() === searchValue.toLowerCase(),
      );
    }
    if (filteredReport) {
      this.setState({
        filteredReport,
        searchResult: true,
      });
    } else {
      this.setState({ searchResult: false });
    }
  }

  openModal = () => {
    this.setState({ isModalOpen: true });
  }

  closeModal = () => {
    this.setState({ isModalOpen: false });
  }

  filterWithAutomationStatus(report) {
    const { filters: { automationStatus } } = this.state;
    return automationStatus.every((filterTerm) => {
      switch (filterTerm) {
        case constants.FAILED_AUTOMATIONS:
          return (!report.slackAutomation.success
            || !report.freckleAutomation.success
            || !report.emailAutomation.success
          );
        case constants.SUCCESSFUL_AUTOMATIONS:
          return (report.slackAutomation.success
            && report.freckleAutomation.success
            && report.emailAutomation.success
          );
        case constants.FAILED_SLACK_AUTOMATIONS:
          return (!report.slackAutomation.success);
        case constants.FAILED_FRECKLE_AUTOMATIONS:
          return (!report.freckleAutomation.success);
        case constants.FAILED_EMAIL_AUTOMATIONS:
          return (!report.emailAutomation.success);
        case constants.SUCCESSFUL_SLACK_AUTOMATIONS:
          return (report.slackAutomation.success);
        case constants.SUCCESSFUL_FRECKLE_AUTOMATIONS:
          return (report.freckleAutomation.success);
        case constants.SUCCESSFUL_EMAIL_AUTOMATIONS:
          return (report.emailAutomation.success);
        default:
          return false;
      }
    });
  }

  filterWithAutomationType(report) {
    const { filters: { automationType } } = this.state;
    return automationType.every((filteTerm) => {
      switch (filteTerm) {
        case constants.ONBOARDING:
          return (report.type === 'Onboarding');
        case constants.OFFBOARDING:
          return (report.type === 'Offboarding');
        default:
          return false;
      }
    });
  }

  filterWithDate(reportDate) {
    const { filters: { date: { from, to } } } = this.state;
    const reportDateTime = new Date(reportDate).getTime();
    const fromTime = new Date(from).getTime();
    const toTime = new Date(to).getTime();
    return (reportDateTime >= fromTime && reportDateTime <= toTime);
  }

  runFilters(report) {
    const { filters } = this.state;
    if (!filters.length) {
      return true;
    }
    const filterResult = [];
    if (filters.automationStatus.length) {
      filterResult.push(this.filterWithAutomationStatus(report));
    }
    if (filters.automationType.length) {
      filterResult.push(this.filterWithAutomationType(report));
    }
    if (filters.date.from && filters.date.to) {
      filterResult.push(this.filterWithDate(report.date));
    }
    return filterResult.every(result => result === true);
  }

  filterReports() {
    const { reportData, filters: previousFilters } = this.state;
    const filteredReport = reportData.filter(report => this.runFilters(report));
    this.setState({
      filteredReport,
      filters: {
        ...previousFilters,
        updated: false,
      },
    });
  }

  redirectToAIS(report) {
    return window.open(`https://ais.andela.com/people/${report.fellowId}`);
  }

  changeModalTypes(report, type) {
    this.setState({ modalContent: report, type });
  }

  redirectToAllocations(engagementId) {
    return window.open(`https://allocations.andela.com/engagements/open/${engagementId}`);
  }

  renderAutomationStatus(automationStatus, report, type) {
    return (
      <span>
        { automationStatus ? 'Success' : 'Failed' }&nbsp;
        <i
          className={`fa fa-info-circle ${automationStatus ? 'success' : 'failed'}`}
          onClick={() => { this.openModal(); this.changeModalTypes(report, type); }}
        />
      </span>
    );
  }

  renderFilters() {
    return constants.filters.map(filter => (
      <Filter
        key={filter.id}
        filterSet={filter.filterSet}
        title={filter.title}
        options={filter.options}
        handleFilterChange={this.setFilter}
      />
    ));
  }

  renderSearch() {
    return <Search handleSearch={this.doSearch} />;
  }

  renderTableRows() {
    const {
      filters, filteredReport, reportData, searchResult,
    } = this.state;
    const reports = filters.length || searchResult ? filteredReport : reportData;
    return reports.map((report, index) => (
      <tr key={report.id}>
        <td className="numbering">{index + 1}</td>
        <td className="column1">{report.date}</td>
        <td
          className="fellow"
          onClick={() => this.redirectToAIS(report)}
        >
          {report.fellowName}

        </td>
        <td className="engagement" onClick={() => this.redirectToAllocations(report.engagementId)}>
          {report.partnerName}
        </td>
        <td>{report.type}</td>
        <td>{this.renderAutomationStatus(report.slackAutomation.success, report, 'slack')}</td>
        <td>{this.renderAutomationStatus(report.emailAutomation.success, report, 'email')}</td>
        <td>{this.renderAutomationStatus(report.freckleAutomation.success, report, 'freckle')}</td>
      </tr>
    ));
  }

  render() {
    const { currentUser, removeCurrentUser, history } = this.props;
    const {
      isModalOpen, modalContent, type, filters,
    } = this.state;
    return (
      <div>
        <Header
          currentUser={currentUser}
          removeCurrentUser={removeCurrentUser}
          history={history}
        />
        <div id="report-page">
          <div className="filter-box">
            <p>Filters</p>
            {this.renderFilters()}
            {this.renderSearch()}
          </div>
          <FiltersBar
            filters={filters}
          />
          <div className="table-header">
            <table className="report-table">
              <thead>
                <tr>
                  <th className="numbering">#</th>
                  <th>Date</th>
                  <th>Fellow Name</th>
                  <th>Partner Name</th>
                  <th>Type</th>
                  <th>Slack</th>
                  <th>Email</th>
                  <th>Freckle</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="table-body">
            <table className="report-table">
              <tbody>
                {this.renderTableRows()}
              </tbody>
            </table>
          </div>
          <AutomationDetails
            isModalOpen={isModalOpen}
            closeModal={this.closeModal}
            modalType={type}
            modalContent={modalContent}
          />
        </div>
      </div>
    );
  }
}

ReportPage.propTypes = {
  currentUser: PropTypes.object.isRequired,
  removeCurrentUser: PropTypes.func,
  history: PropTypes.object.isRequired,
};

ReportPage.defaultProps = {
  removeCurrentUser: () => {},
};

export default ReportPage;
