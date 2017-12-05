import '../Complaints.css';
import {loadFirebase, getDate} from '../../../helpers/functions.js';
import API from "../../../api/API.js";
import SubmitComplaints from './SubmitComplaints';
import PastComplaints from './PastComplaints';

import React, {Component} from 'react';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

export default class ActiveComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      open: false,
      pledge: null,
      description: '',
      pledgeArray: this.props.pledgeArray,
      pledgeValidation: true,
      descriptionValidation: true,
      complaintsArray: this.props.complaintsArray
    };
  }

  componentDidMount() {
    if (navigator.onLine) {
      loadFirebase('database')
      .then(() => {
        let firebase = window.firebase;
        let complaintsRef = firebase.database().ref('/complaints/');

        API.getPledgesForComplaints()
        .then((res) => {
          let pledgeArray = res.data;
          console.log(pledgeArray)

          complaintsRef.on('value', (snapshot) => {
            let complaintsArray = Object.keys(snapshot.val()).map(function(key) {
              return snapshot.val()[key];
            });

            console.log('Pledge Complaints Array: ', pledgeArray);
            console.log('Complaints Array: ', complaintsArray);

            localStorage.setItem('pledgeComplaintsArray', JSON.stringify(pledgeArray));
            localStorage.setItem('activeComplaintsArray', JSON.stringify(complaintsArray));
            
            this.setState({
              pledgeArray: pledgeArray,
              complaintsArray: complaintsArray
            });
          });
        })
        .catch(err => console.log(err));
      });
    }
  }

  select = (index) => {
    let previousIndex = this.state.selectedIndex;
    let submitComplaints = document.getElementById('submit-complaints');
    let pastComplaints = document.getElementById('past-complaints');

    if (previousIndex !== index) {
      submitComplaints.classList.toggle('active');
      pastComplaints.classList.toggle('active');
    }

    this.setState({selectedIndex: index});
  }

  complain = (pledge) => {
    let activeName = this.props.state.name;
    let description = this.state.description;
    let descriptionValidation = true;
    let pledgeValidation = true;

    if (!pledge || !description) {
      if (!pledge) {
        pledgeValidation = false;
      }
      if (!description) {
        descriptionValidation = false;
      }

      this.setState({
        pledgeValidation: pledgeValidation,
        descriptionValidation: descriptionValidation
      });
    }
    else {
      let date = getDate();
      
      API.complain(activeName, pledge, description, date)
      .then(res => {
        console.log(res);
        this.props.handleRequestOpen(`Created a complaint for ${pledge.label}`);

        this.setState({
          open: false,
          description: '',
          pledge: null
        });
      })
      .catch(err => console.log('err', err));
    }
  }

  handleChange = (label, newValue) => {
    let validationLabel = [label] + 'Validation';
    let value = newValue;

    this.setState({
      [label]: value,
      [validationLabel]: true
    });
  }

  render() {
    return (
      <div>
        <SubmitComplaints
          pledge={this.state.pledge}
          pledgeArray={this.state.pledgeArray}
          pledgeValidation={this.state.pledgeValidation}
          description={this.state.description}
          descriptionValidation={this.state.descriptionValidation}
          complain={this.complain}
          handleChange={this.handleChange}
        />
        <PastComplaints
          complaintsArray={this.state.complaintsArray}
        />

        <BottomNavigation id="complaints-tabs" selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label="Submit Complaint"
            icon={<div></div>}
            onClick={() => this.select(0)}
          />
          <BottomNavigationItem
            label="Past Complaints"
            icon={<div></div>}
            onClick={() => this.select(1)}
          />
        </BottomNavigation>
      </div>
    )
  }
}
