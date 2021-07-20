import React from "react";
import * as dateFns from "date-fns";
import reactDom from "react-dom";
import { render } from "react-dom/cjs/react-dom.development";
import { useState } from "react";

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    eventList: {}
  };

  componentDidMount(){
     let userEvents = 
       fetch('http://localhost:5000/showEvents', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            uid: sessionStorage.getItem("uid"),
        })
      })
  
        .then(response => {
          if(response.status === 200){
              console.log("response is 200")
              return response.json()
          }
      })
      .then(events => {
          this.setState({eventList: events});
      });
  };

  renderHeader() {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "iiii";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const userEvents = Object.values(this.state.eventList);
    console.log(userEvents);
    const { currentMonth, selectedDate } = this.state;

    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);
    

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        let dayEvent = "";
        let i = 0;

        for(const eve of userEvents){
          if(eve.date == this.convert(cloneDay)){
            var name = eve.eventName;
            var date = eve.date;
            var startTime = eve.startTime;
            var endTime = eve.endTime;
            dayEvent += name +  "   " + startTime + "     " + endTime + "\n";
            //dayEvent += JSON.stringify(eve);
          }
        }

        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
            }`}
            key={day}
           //onClick={() => this.addEvent(cloneDay)}
          >

            <span className="number">{formattedDate}</span>
            
            <div className = "event"> {dayEvent} </div>
            <span className="bg">{formattedDate}</span>
            
          </div>
        );
        
        day = dateFns.addDays(day, 1);
      
    }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body" id="body">{rows}</div>;
  }


  addEvents(){
    window.location.href = "http://localhost:3000/addEvent";
  }

    //convert day format
 convert(str) {
    var mnths = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
    },
      str = str + ""
      var date = str.split(" ");
    return [date[3], mnths[date[1]], date[2]].join("-");
  };



  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };



  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
        <button type="button" className="btn" onClick={this.addEvents}>Add Event</button>

      </div>
    );
  }
}

export default Calendar;