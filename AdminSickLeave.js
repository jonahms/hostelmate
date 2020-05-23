import React, { Component } from 'react';
import {withFirebase} from './Firebase';
import './AdminSickLeave.css'

class AdminSickLeave extends Component {
  constructor(props){
    super(props);
    this.state = {
      sickleave: []
      };
  };
  componentDidMount(){
    const sickleaveRef = this.props.firebase.database.ref('sickleave/')
    sickleaveRef.once('value', (snapshot) => {
      let sickleavesnap = snapshot.val();
      let newState = [];
      for (let sickleave in sickleavesnap){
        newState.push({
         sickLeaveBlock: sickleavesnap[sickleave].sickLeaveBlock,
          sickLeaveDate: sickleavesnap[sickleave].sickLeaveDate,
          sickLeaveDescription: sickleavesnap[sickleave].sickLeaveReason,
          //nightstudyImageUrl: nightstudysnap[nightstudy].nightstudyImageUrl,
          sickLeaveReportedBy: sickleavesnap[sickleave].sickLeaveReportedBy,
          sickLeaveRoom: sickleavesnap[sickleave].sickLeaveRoom,
          sickLeaveStatus: sickleavesnap[sickleave].sickLeaveStatus, 
          sickLeaveTitle: sickleavesnap[sickleave].sickLeaveTitle
        });
      }
      this.setState({sickleave: newState}); 
    });
  };
  render(){
    return(
      <div>
        <h1>Sick Leave Request</h1>
        {this.state.sickleave.map((sickleave)=>{
          return(
            <div className="uk-container cards">
            <div className="uk-card uk-card-secondary uk-grid">
             
              <div className="uk-card-body uk-width-1-2">
                  <h3 className="uk-card-title">{sickleave.sickLeaveTitle}</h3>
                  <p>Date: {sickleave.sickLeaveDate}</p>
                  <p>sickleave Description: {sickleave.sickLeaveDescription}</p>
                  <p>sickleave Block: {sickleave.sickLeaveBlock}</p>
                  <p>sickleave Room: {sickleave.sickLeaveRoom}</p>
                  <p>sickleave Reported By: {sickleave.sickLeaveReportedBy}</p>
                 <p>{sickleave.sickLeaveStatus === "approved"? <StatusFixed/>:<StatusNotFixed id={sickleave.sickLeaveId} fb={this.props.firebase.database}/>}</p>
              
              </div>
            </div>
            </div>
          );
      }
          )}
          </div>
    );
  }
}

const StatusFixed=()=>(
  <p>sickLeave Status: <span class= "green">approved</span></p>
);



class StatusNotFixed extends Component{
  constructor(props){
    super(props);
    this.state = {reset: "pending"};
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e){
    const itemRef = this.props.fb.ref('sickleave/');
    itemRef.child(this.props.id).update({'sickLeaveStatus': "approved"});
    this.setState({reset: "approved"});
   }
   render(){
    return (
    <p>SickLeave Status: <span class= "yellow">Pending</span>
          <div class="uk-margin">
 	        <p uk-margin>
            <button class="uk-button uk-button-primary">ACCEPT</button>
	         <button class="uk-button uk-button-danger" type="button" uk-toggle="target: #toggle-usage">REJECT</button>
          </p>
          <label class="uk-form-label" for="form-horizontal-text" id="toggle-usage" hidden>Comments / Reason for Rejection</label>
               <div class="uk-form-controls">
               <input class="uk-input" id="toggle-usage" type="text" placeholder="" hidden />
               <button className="uk-icon-button" uk-icon="check" style={{backgroundColor: "green", float: "right"}}  id="toggle-usage" onClick={this.handleClick} hidden></button>
 
              </div>
             </div> 
    
 </p>
  );
    }
}
   

export default withFirebase(AdminSickLeave);