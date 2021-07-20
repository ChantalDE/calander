import React, { Component } from "react";

export default class addEvent extends Component {
    render() {
        return (
            <form>
                <h3>Add Event</h3>

                <div className="form-group">
                    <label>Event Name</label>
                    <input type="eventName" id="event" className="form-control" placeholder="Enter event Name" />
                </div>

                <div className="form-group">
                    <label>Date</label>
                    <input type="date" id="Date" className="form-control" placeholder="yyyy-mm-dd" />
                </div>

                <div className="form-group">
                    <label>Start Time</label>
                    <input type="time" id="StartTime" className="form-control" placeholder="hh:mm:ss" />
                </div>

                <div className="form-group">
                    <label>End Time</label>
                    <input type="time" id="EndTime" className="form-control" placeholder="hh:mm:ss" />
                </div>

                <button onClick={this.addEvent} type="reset" className="btn btn-primary btn-block">Submit</button>
                <button type="button" className="btn cancel" onClick={this.goBack}>Go Back</button>

            </form>
        );
    }
    goBack(){
        window.location.href = "http://localhost:3000/calendar"
    }

    addEvent(){    
        var event = {
            uid: sessionStorage.getItem("uid"),
            day: document.getElementById("Date").value,
            eventname: document.getElementById("event").value,
            starttime: document.getElementById("StartTime").value,
            endtime: document.getElementById("EndTime").value
        };

        console.log("test" + JSON.stringify(event))
       
        fetch('http://localhost:5000/addEvents', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
             // 'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(event)
          })
          
    }

}