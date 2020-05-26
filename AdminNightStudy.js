import React, { Component } from 'react';
import {withFirebase} from './Firebase';
import './AdminIssue.css'

class AdminNightStudy extends Component {
  constructor(props){
    super(props);
    this.state = {
      nightStudys: [],
      nightStudyStatus: "Pending",
      nightStudyReasonForRejection: ""
    };
    this.resetState = this.resetState.bind(this);
  }
  resetState(dataFromPending){
    this.setState({nightStudyStatus: dataFromPending});
  }
  componentDidMount(){
    const nightRef = this.props.firebase.database.ref('nightstudy/');
    nightRef.once('value', (snapshot) => {
    let nightStudysnap = snapshot.val();
    let newState = [];
    for (let nightStudy in nightStudysnap){
      newState.push({
        nightStudyBlock: nightStudysnap[nightStudy].nightStudyBlock,
        nightStudyDate: nightStudysnap[nightStudy].nightStudyDate,
        nightStudyId: nightStudysnap[nightStudy].nightStudyId,
        nightStudyReason: nightStudysnap[nightStudy].nightStudyReason,
        nightStudyReasonForRejection: nightStudysnap[nightStudy].nightStudyReasonForRejection,
        nightStudyReportedBy: nightStudysnap[nightStudy].nightStudyReportedBy,
        nightStudyRoom: nightStudysnap[nightStudy].nightStudyRoom,
        nightStudyStatus: nightStudysnap[nightStudy].nightStudyStatus, 
        nightStudyTitle: nightStudysnap[nightStudy].nightStudyTitle
      });
    }
    this.setState({nightStudys: newState}); 
    });
    
  };
  render(){
    return(
      <div>
        <h1>Reported nightStudy</h1>
        {this.state.nightStudys.map((nightStudy)=>{
          let clickables, reset = false;
          if(nightStudy.nightStudyStatus === "Pending"){
            reset = true;
            clickables= <Pending callbackFromParent={this.resetState} id ={nightStudy.nightStudyId} fb={this.props.firebase.database}/>
          }          
          return(
            <div className="uk-container cards">
            <div className="uk-card uk-card-secondary uk-grid">
              <div className="uk-card-body uk-width-1-2">
                <h3 className="uk-card-title">{nightStudy.nightStudyTitle}</h3>
                <p>Date of nightStudy: {nightStudy.nightStudyDate}</p>
                <p>nightStudy Description: {nightStudy.nightStudyReason}</p>
                <p>nightStudy Block: {nightStudy.nightStudyBlock}</p>
                <p>nightStudy Room: {nightStudy.nightStudyRoom}</p>
                <p>nightStudy Reported By: {nightStudy.nightStudyReportedBy}</p>
                <p>night Study Status: <span className={reset?this.state.nightStudyStatus:nightStudy.nightStudyStatus}>{reset?this.state.nightStudyStatus:nightStudy.nightStudyStatus}</span></p> 
                {nightStudy.nightStudyStatus === "Rejected" ? <p>Reason For Rejection: {nightStudy.nightStudyReasonForRejection}</p>:<p></p>}
                {this.state.nightStudyStatus === "Rejected" && nightStudy.nightStudyStatus !== "Approved" && nightStudy.nightStudyStatus !== "Pending" && nightStudy.nightStudyStatus!== "Rejected"? <p>Reason For Rejection: {this.state.nightStudyReasonForRejection}</p>:<p></p>}
              </div>
              {this.state.nightStudyStatus === "Pending"?<div className="uk-card-media-left uk-width-1-2 ">
                 {clickables}
              </div>:<p></p>}
              
            </div>
            </div>
          );
        }
          )}
          </div>
    );
  }
}

class Pending extends Component{
  constructor(props){
    super(props);
    this.state ={
      nightStudyStatus: "Pending",
      nightStudyReasonForRejection: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClickAccept = this.handleClickAccept.bind(this);
    this.handleClickReject = this.handleClickReject.bind(this);
  }
  shouldComponentUpdate() {
    return true;
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleClickAccept(e){
    const itemRef = this.props.fb.ref('nightstudy/');
    itemRef.child(this.props.id).update({"nightStudyStatus": "Approved"});
    this.props.callbackFromParent("Approved");
  }
  handleClickReject(e){
    const itemReff = this.props.fb.ref('nightstudy/');
    var newUserData = {
      "nightStudyStatus" : "Rejected",
      "nightStudyReasonForRejection": this.state.nightStudyReasonForRejection
    }
    itemReff.child(this.props.id).update(newUserData);
    this.props.callbackFromParent("Rejected");
  }
  render(){
    return(
      <div className="uk-container uk-align-center">
        <button className="uk-button uk-button-default greenback" onClick={this.handleClickAccept}>Approve</button>
        <button uk-toggle="target: #my-id" type="button" className="uk-button uk-button-default redback">Reject</button>
        <div id="my-id" hidden>
          <textarea className="uk-textarea" name="nightStudyReasonForRejection" value={this.state.value} onChange = {this.handleChange}></textarea>
          <button className="uk-icon-button" uk-icon="check" style={{backgroundColor: "green", float: "right"}} onClick={this.handleClickReject}></button>
        </div>
      </div>
    );
  }
}
export default withFirebase(AdminNightStudy);