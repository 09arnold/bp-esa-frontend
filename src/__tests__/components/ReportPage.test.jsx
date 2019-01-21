import React from 'react';
import ReportPage from '../../components/ReportPage';

const props = {
  currentUser: {},
  history: {},
  removeCurrentUser: jest.fn(),
  formatDates: jest.fn(),
};

const sampleReports = [
  {
    id: 1,
    fellowName: 'Tunmise',
    partnerName: 'Andela',
    type: 'onboarding',
    slackAutomations: {
      status: 'failure',
      slackActivities: [
        {
          channelName: 'andela-int',
          type: 'Addition',
        },
        {
          channelName: 'andela',
          type: 'Removal',
        },
      ],
    },
    freckleAutomations: {
      status: 'failure',
    },
    emailAutomations: {
      status: 'failure',
    },
    updatedAt: '2017-09-29 ',
  },
  {
    id: 2,
    fellowName: 'Shakira',
    partnerName: 'ESA',
    type: 'offboarding',
    slackAutomations: {
      status: 'success',
    },
    freckleAutomations: {
      status: 'success',
    },
    emailAutomations: {
      status: 'success',
    },
    updatedAt: '2018-09-29',
  },
];

const getComponent = () => shallow(<ReportPage {...props} />);

describe('<ReportPage />', () => {
  it('should render as expected', () => {
    expect(getComponent()).toMatchSnapshot();
  });

  describe('componenDidUpdate method', () => {
    it(`should call filterReports method if the 
    filters in the state is updated`, () => {
      const component = getComponent();
      const componentInstance = component.instance();
      jest.spyOn(componentInstance, 'filterReports');
      expect(componentInstance.filterReports).toHaveBeenCalledTimes(0);
      const previousFilters = component.state('filters');
      component.setState({ filters: { ...previousFilters, updated: true } });
      expect(componentInstance.filterReports).toHaveBeenCalledTimes(1);
    });
  });

  describe('setFilter method', () => {
    describe('Automation status filter set', () => {
      const filterSet = 'automationStatus';
      it(`should add a filter to the state and increment the filter length
      if action is add_filter`, () => {
        const component = getComponent();
        const componentInstance = component.instance();
        expect(component.state('filters').automationStatus).toEqual([]);
        expect(component.state('filters').length).toEqual(0);
        componentInstance.setFilter('failed_automations', filterSet, 'add_filter');
        expect(component.state('filters').automationStatus).toEqual(['failed_automations']);
        expect(component.state('filters').length).toEqual(1);
      });
      it(`should remove a filter in the state and reduce the filter length
       if action is remove_filter`, () => {
        const component = getComponent();
        const componentInstance = component.instance();
        const previousFilters = component.state('filters');
        component.setState({
          filters: {
            ...previousFilters,
            automationStatus: ['failed_automations'],
            length: 1,
          },
        });
        componentInstance.setFilter('failed_automations', filterSet, 'remove_filter');
        expect(component.state('filters').automationStatus).toEqual([]);
        expect(component.state('filters').length).toEqual(0);
      });
    });

    describe('Automation type filter set', () => {
      const filterSet = 'automationType';
      it(`should add a filter to the state and increment the filter length,
      if action is add_filter`, () => {
        const component = getComponent();
        const componentInstance = component.instance();
        expect(component.state('filters').automationType).toEqual([]);
        expect(component.state('filters').length).toEqual(0);
        componentInstance.setFilter('failed_automations', filterSet, 'add_filter');
        expect(component.state('filters').automationType).toEqual(['failed_automations']);
        expect(component.state('filters').length).toEqual(1);
      });
      it(`should remove a filter in the state and reduce the filter length
      if action is remove_filter`, () => {
        const component = getComponent();
        const componentInstance = component.instance();
        const previousFilters = component.state('filters');
        component.setState({
          filters: {
            ...previousFilters,
            automationType: ['failed_automations'],
            length: 1,
          },
        });
        componentInstance.setFilter('failed_automations', filterSet, 'remove_filter');
        expect(component.state('filters').automationType).toEqual([]);
        expect(component.state('filters').length).toEqual(0);
      });
    });

    describe('Date filter set', () => {
      const filterSet = 'date';
      const sampleDateFilter = '12/02/2018';
      it(`should add a date-filter to the state and increment the filter length
      if action is set_from_date`, () => {
        const component = getComponent();
        const componentInstance = component.instance();
        expect(component.state('filters').date.from).toEqual('');
        expect(component.state('filters').length).toEqual(0);
        componentInstance.setFilter(sampleDateFilter, filterSet, 'set_from_date');
        expect(component.state('filters').date.from).toEqual(sampleDateFilter);
        expect(component.state('filters').length).toEqual(1);
      });
      it(`should add a date-filter to the state and increment the filter length
      if action is set_to_date`, () => {
        const component = getComponent();
        const componentInstance = component.instance();
        expect(component.state('filters').date.to).toEqual('');
        expect(component.state('filters').length).toEqual(0);
        componentInstance.setFilter(sampleDateFilter, filterSet, 'set_to_date');
        expect(component.state('filters').date.to).toEqual(sampleDateFilter);
        expect(component.state('filters').length).toEqual(1);
      });
      it('should not change filter length if a date filter previously existed', () => {
        const component = getComponent();
        const componentInstance = component.instance();
        const previousFilters = component.state('filters');
        component.setState({ filters: { ...previousFilters, date: { from: '15/02/2018', to: '20/02/2018' }, length: 2 } });
        componentInstance.setFilter(sampleDateFilter, filterSet, 'set_from_date');
        expect(component.state('filters').length).toEqual(2);
        componentInstance.setFilter(sampleDateFilter, filterSet, 'set_to_date');
        expect(component.state('filters').length).toEqual(2);
      });
      it('should reduce filter length if an empty date filter is to be set', () => {
        const component = getComponent();
        const componentInstance = component.instance();
        const previousFilters = component.state('filters');
        component.setState({ filters: { ...previousFilters, date: { from: '15/02/2018', to: '20/02/2018' }, length: 2 } });
        componentInstance.setFilter('', filterSet, 'set_from_date');
        expect(component.state('filters').length).toEqual(1);
        componentInstance.setFilter('', filterSet, 'set_to_date');
        expect(component.state('filters').length).toEqual(0);
      });
    });
  });

  describe('filterReports method', () => {
    it('should filter out the failed automations', () => {
      const component = getComponent();
      const previousFilters = component.state('filters');
      expect(component.state('filteredReport')).toEqual([]);
      component.setState({
        reportData: sampleReports,
        filters: {
          ...previousFilters,
          automationStatus: ['FAILED_AUTOMATIONS'],
          length: 1,
          updated: true,
        },
      });
      expect(component.state('filteredReport')).toEqual([sampleReports[0]]);
    });

    it('should filter out the successful automations', () => {
      const component = getComponent();
      const previousFilters = component.state('filters');
      expect(component.state('filteredReport')).toEqual([]);
      component.setState({
        reportData: sampleReports,
        filters: {
          ...previousFilters,
          automationStatus: ['SUCCESSFUL_AUTOMATIONS'],
          length: 1,
          updated: true,
        },
      });
      expect(component.state('filteredReport')).toEqual([sampleReports[1]]);
    });

    it('should filter out the successful slack automations', () => {
      const component = getComponent();
      const previousFilters = component.state('filters');
      expect(component.state('filteredReport')).toEqual([]);
      component.setState({
        reportData: sampleReports,
        filters: {
          ...previousFilters,
          automationStatus: ['SUCCESSFUL_SLACK_AUTOMATIONS'],
          length: 1,
          updated: true,
        },
      });
      expect(component.state('filteredReport')).toEqual([sampleReports[1]]);
    });

    it('should filter out the failed slack automations', () => {
      const component = getComponent();
      const previousFilters = component.state('filters');
      expect(component.state('filteredReport')).toEqual([]);
      component.setState({
        reportData: sampleReports,
        filters: {
          ...previousFilters,
          automationStatus: ['FAILED_SLACK_AUTOMATIONS'],
          length: 1,
          updated: true,
        },
      });
      expect(component.state('filteredReport')).toEqual([sampleReports[0]]);
    });

    it('should filter out the successful freckle automations', () => {
      const component = getComponent();
      const previousFilters = component.state('filters');
      expect(component.state('filteredReport')).toEqual([]);
      component.setState({
        reportData: sampleReports,
        filters: {
          ...previousFilters,
          automationStatus: ['SUCCESSFUL_FRECKLE_AUTOMATIONS'],
          length: 1,
          updated: true,
        },
      });
      expect(component.state('filteredReport')).toEqual([sampleReports[1]]);
    });

    it('should filter out the failed freckle automations', () => {
      const component = getComponent();
      const previousFilters = component.state('filters');
      expect(component.state('filteredReport')).toEqual([]);
      component.setState({
        reportData: sampleReports,
        filters: {
          ...previousFilters,
          automationStatus: ['FAILED_FRECKLE_AUTOMATIONS'],
          length: 1,
          updated: true,
        },
      });
      expect(component.state('filteredReport')).toEqual([sampleReports[0]]);
    });

    it('should filter out the successful email automations', () => {
      const component = getComponent();
      const previousFilters = component.state('filters');
      expect(component.state('filteredReport')).toEqual([]);
      component.setState({
        reportData: sampleReports,
        filters: {
          ...previousFilters,
          automationStatus: ['SUCCESSFUL_EMAIL_AUTOMATIONS'],
          length: 1,
          updated: true,
        },
      });
      expect(component.state('filteredReport')).toEqual([sampleReports[1]]);
    });

    it('should filter out the failed email automations', () => {
      const component = getComponent();
      const previousFilters = component.state('filters');
      expect(component.state('filteredReport')).toEqual([]);
      component.setState({
        reportData: sampleReports,
        filters: {
          ...previousFilters,
          automationStatus: ['FAILED_EMAIL_AUTOMATIONS'],
          length: 1,
          updated: true,
        },
      });
      expect(component.state('filteredReport')).toEqual([sampleReports[0]]);
    });

    it('should filter out the onboarding automations', () => {
      const component = getComponent();
      const previousFilters = component.state('filters');
      expect(component.state('filteredReport')).toEqual([]);
      component.setState({
        reportData: sampleReports,
        filters: {
          ...previousFilters,
          automationType: ['ONBOARDING'],
          length: 1,
          updated: true,
        },
      });
      expect(component.state('filteredReport')).toEqual([sampleReports[0]]);
    });

    it('should filter out the offboarding automations', () => {
      const component = getComponent();
      const previousFilters = component.state('filters');
      expect(component.state('filteredReport')).toEqual([]);
      component.setState({
        reportData: sampleReports,
        filters: {
          ...previousFilters,
          automationType: ['OFFBOARDING'],
          length: 1,
          updated: true,
        },
      });
      expect(component.state('filteredReport')).toEqual([sampleReports[1]]);
    });

    it('should filter report with date', () => {
      const component = getComponent();
      const previousFilters = component.state('filters');
      expect(component.state('filteredReport')).toEqual([]);
      component.setState({
        reportData: sampleReports,
        filters: {
          ...previousFilters,
          date: { from: '2018-09-01', to: '2018-09-30' },
          length: 2,
          updated: true,
        },
      });
      expect(component.state('filteredReport')).toEqual([sampleReports[1]]);
    });

    it('should not filter report if filter is not valid', () => {
      const component = getComponent();
      const previousFilters = component.state('filters');
      expect(component.state('filteredReport')).toEqual([]);
      component.setState({
        reportData: sampleReports,
        filters: {
          ...previousFilters,
          automationStatus: ['SOME_RANDOM_FILTER'],
          length: 1,
          updated: true,
        },
      });
      expect(component.state('filteredReport')).toEqual([]);
    });
  });

  describe('doSearch method', () => {
    it(`should return a filtered report when
    searchResults for fellow in the state is updated`, () => {
      const component = getComponent();
      const componentInstance = component.instance();
      component.setState({ reportData: sampleReports });
      expect(component.state('searchResult')).toEqual(false);
      expect(component.state('filteredReport')).toEqual([]);
      componentInstance.doSearch('Shakira', 1);
      expect(component.state('searchResult')).toEqual(true);
      expect(component.state('filteredReport')).toEqual([sampleReports[1]]);
    });

    it(`should not return a filtered report when
    searchResults in the state is not updated`, () => {
      const component = getComponent();
      const componentInstance = component.instance();
      component.setState({ reportData: sampleReports });
      expect(component.state('searchResult')).toEqual(false);
      expect(component.state('filteredReport')).toEqual([]);
      componentInstance.doSearch('', '');
      expect(component.state('searchResult')).toEqual(false);
      expect(component.state('filteredReport')).toEqual([]);
    });

    it(`should return a filtered report when
    searchResults in the state is updated`, () => {
      const component = getComponent();
      const componentInstance = component.instance();
      component.setState({ reportData: sampleReports });
      expect(component.state('searchResult')).toEqual(false);
      expect(component.state('filteredReport')).toEqual([]);
      componentInstance.doSearch('Andela', 2);
      expect(component.state('searchResult')).toEqual(true);
      expect(component.state('filteredReport')).toEqual([sampleReports[0]]);
    });

    it('should redirect to the AIS page when you click the fellow name', () => {
      // eslint-disable-next-line no-undef
      const component = getComponent();
      component.setState({ reportData: sampleReports });
      const redirectToAIS = component.find('.table-body').find('tr').at(0).find('.fellow');
      global.open = jest.fn();
      redirectToAIS.simulate('click');
      expect(global.open).toHaveBeenCalled();
    });
    it('should render a slack modal when the slack status icons are clicked', () => {
      const component = getComponent();
      component.setState({ reportData: sampleReports });
      component.find('.fa.fa-info-circle.success').at(0).simulate('click');
      expect(component.state('type')).toEqual('slack');
    });

    it('should render an email modal when the email status icons are clicked', () => {
      const component = getComponent();
      component.setState({ reportData: sampleReports });
      component.find('.fa.fa-info-circle.success').at(1).simulate('click');
      expect(component.state('type')).toEqual('email');
    });

    it('should render a freckle modal when the freckle status icons are clicked', () => {
      const component = getComponent();
      component.setState({ reportData: sampleReports });
      component.find('.fa.fa-info-circle.success').at(2).simulate('click');
      expect(component.state('type')).toEqual('freckle');
    });
  });
});
