import React from 'react';
import { mount } from 'enzyme';
import AutomationDetails from '../../components/AutomationDetails';
import ReportPage from '../../components/ReportPage';

const props = {
  history: {},
  currentUser: {
    additionalUserInfo: { profile: { name: 'Kelvin', picture: 'ddff' } },
  },
  formatDates: jest.fn(),
  isModalOpen: false,
  closeModal: jest.fn(),
  modalType: 'slack',
  modalContent: {
    id: 1,
    fellowName: 'Tunmise',
    partnerName: 'Andela',
    type: 'Onboarding',
    slackAutomations: {
      status: 'success',
      slackActivities: [
        {
          channelName: 'andela-int',
          type: 'Addition',
          status: 'success',
        },
        {
          channelName: 'andela',
          type: 'Removal',
          status: 'success',
        },
      ],
    },
    freckleAutomations: {
      status: 'failure',
      freckleActivities: [
        {
          status: 'failure',
          statusMessage: 'Request failed with status code 403',
          freckleUserId: null,
          projectId: null,
          type: 'projectCreation',
        },
      ],
    },
    emailAutomations: {
      status: 'success',
      emailActivities: [{
        id: 1,
        emailTo: 'Tunmise.ogunniyi@andela.com',
        subject: 'Onboarding',
        status: 'success',
      },
      {
        id: 2,
        emailTo: 'Tunmise.ogunniyi@andela.com',
        subject: 'Onboarding',
        status: 'success',
      },
      ],
    },
    date: '2017-09-29 01:22',
  },
};

const getComponent = () => shallow(<AutomationDetails {...props} />);

describe('Automation details', () => {
  it('should render slack details', () => {
    expect(getComponent()).toMatchSnapshot();
  });

  it('should render email details', () => {
    const component = getComponent();
    component.setProps({
      modalType: 'email',
    });
    expect(getComponent()).toMatchSnapshot();
    expect(component.find('.table-body-details')).toBeTruthy();
  });

  it('should render freckle details', () => {
    const component = getComponent();
    component.setProps({
      modalType: 'freckle',
    });
    expect(getComponent()).toMatchSnapshot();
  });
});
