import React, { PureComponent } from 'react';
import PropTypes from 'proptypes';
import './styles.scss';

class AutomationDetails extends PureComponent {
  renderAutomation = (status) => {
    if (status === 'success') {
      return <h4 className="modal-values">Success</h4>;
    }
    return <h4 className="modal-values">Failed</h4>;
  }

  renderModalDetails = (modalType, modalContent) => (
    <div>
      <h1 className="modal-title">
        {modalType}
        {' '}
        Automation Details
      </h1>
      <div className="line">
        <span className="long" />
        <span className="short" />
      </div>
      {this.renderCommonDetails(modalContent, modalType)}
      { (modalType === 'email' || modalType === 'slack') && this.renderModalTable(modalContent, modalType)}
    </div>
  );

  renderCommonDetails = (modalContent, modalType) => {
    const { formatDates } = this.props;
    return (
      <div className="flex-container">
        <div className="modal-data">
          <h2 className="modal-labels"> Developer Name:</h2>
          <h4 className="modal-labels"> Partner Name:</h4>
          <h4 className="modal-labels"> Date:</h4>
          <h4 className="modal-labels"> Status:</h4>
          {modalType === 'freckle' && <h4 className="modal-labels"> Type:</h4>}
        </div>
        <div className="modal-data">
          <h4 className="modal-values">{modalContent.fellowName}</h4>
          <h4 className="modal-values">{modalContent.partnerName}</h4>
          <h4 className="modal-values">{formatDates(modalContent.updatedAt)}</h4>
          {modalType === 'slack' && this.renderAutomation(modalContent.slackAutomations.status)}
          {modalType === 'email' && this.renderAutomation(modalContent.emailAutomations.status)}
          {modalType === 'freckle' && this.renderAutomation(modalContent.freckleAutomations.status)}
          {modalType === 'freckle' && (
          <h4 className="modal-values">
            {modalContent.freckleAutomations.freckleActivities.map(activity => activity.type)}
          </h4>
          )}
        </div>
      </div>
    );
  }

  renderModalTable = (modalContent, modalType) => {
    const contents = modalType === 'email' ? modalContent.emailAutomations.emailActivities : modalContent.slackAutomations.slackActivities;
    return (
      <div className="table-header-details">
        <table className="details-table">
          <thead>
            <tr>
              {modalType === 'email' ? <th>Sent to</th> : <th>Channel</th>}
              {modalType === 'email' ? <th>Subject</th> : <th>Auto Type</th>}
              <th>Status</th>
            </tr>
          </thead>
        </table>
        {contents.map(content => (
          <div key={modalType === 'email' ? content.id : content.channelName} className="table-body-details">
            <table className="details-table">
              <tbody>
                <tr>
                  {this.renderTableData(content, modalType)}
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }

  renderTableData = (content, modalType) => {
    let automationMedia = content.channelName;
    let automationTitle = content.type;
    if (modalType === 'email') {
      automationMedia = content.emailTo;
      automationTitle = content.subject;
    }
    return (
      <React.Fragment>
        <td>{automationMedia}</td>
        <td>{automationTitle}</td>
        {content.success ? <td>Success</td> : <td>Failed</td>}
      </React.Fragment>
    );
  }

  render() {
    const {
      isModalOpen,
      closeModal,
      modalContent,
      modalType,
    } = this.props;
    const modalClass = isModalOpen ? 'modal-open' : 'modal-closed';
    return (
      <div className={modalClass}>
        <div className="modal-overlay" onClick={closeModal} />
        <div className={`modal-body ${modalType}`}>
          <i className="fas fa-times" onClick={closeModal} />
          {this.renderModalDetails(modalType, modalContent)}
        </div>
      </div>
    );
  }
}

AutomationDetails.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalContent: PropTypes.object.isRequired,
  modalType: PropTypes.string.isRequired,
  formatDates: PropTypes.func.isRequired,

};

export default AutomationDetails;
