import React, { Component , useState} from 'react';
import classes from './NightStudy.module.css';
import {withFirebase} from './Firebase';

class NightStudy extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var dd = (today.getDate() < 10 ? '0' : '') + today.getDate(); 
    var MM = ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1); 
    var date = dd + '-' + MM + '-' + today.getFullYear() ;

    this.state = {
      title:'',
      block:'',
      description: '',
      room: '',
      issueDate: date,
      status: 'pending'
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); 
  }
  
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const storage = this.props.firebase.storage;
    
    var date=new Date();
    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate(); 
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1); 

    const itemsRef = this.props.firebase.database.ref('nightstudy/');
     const item = {
              nightStudyBlock: this.state.block,
              nightStudyDate: this.state.issueDate,
              nightStudyReason: this.state.description,
              nightStudyReportedBy:'',
              nightStudyRoom: this.state.room,
              nightStudyTitle: this.state.title,
              nightStudyReasonForRejection:'',
              nightStudyStatus:this.state.status,
            }
            var place = itemsRef.push(item);
            itemsRef.child(place.key).update({'nightstudyId': place.key});
            this.setState({
              title:'',
              block:'',
              description: '',
              room: '',
              status:'pending'
            });
  }

  render() {
    return (
      <div>
        <header>
            <div>
              <h1>Night Study Request</h1>
              
            </div>
        </header>
        {this.datemet}
        <div>
          <section className={classes.additem}>
              <form onSubmit={this.handleSubmit}>
                <label>Title:</label>
                <input type="text" name='title' value={this.state.value} onChange={this.handleChange} />
                <label>Block:</label> 
                <select name='block' value={this.state.value} onChange={this.handleChange}>
                  <option value="selectb">Select Block</option>
				          <option value="A">A</option>
				          <option value="B">B</option>
				          <option value="C">C</option>
			            <option value="D">D</option>
			            <option value="E">E</option>
			            <option value="F">F</option>
                </select>                
                <label>Room:</label>
                <select name='room' value={this.state.value} onChange={this.handleChange}>
                  <option value="selectr">Select Room</option>
				          <option value="100">100</option>
				          <option value="200">200</option>
				          <option value="300">300</option>
			            <option value="400">400</option>
			            <option value="500">500</option>
			            <option value="600">600</option>
                </select>
                <label>Description:</label>
                <textarea name='description' value={this.state.value} onChange={this.handleChange} />
                
                <input className="button" type="submit" value="Create Request"/>
              </form>
          </section>
        </div>
      </div>
    );
  }
}
export default withFirebase(NightStudy);