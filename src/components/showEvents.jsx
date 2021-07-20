import React, { Component } from "react";

export default class showEvents extends Component {
    render() {
        return (
            <>
          {/* {this.events()} */}

               <h2>Events of {sessionStorage.getItem("date")}</h2>

                <p>{this.printEvents()}</p>
                <button type="button" className="btn cancel" onClick={this.showEvents}>Go Back</button>

            </>
        );
    }

    showEvents(){
    window.location.href = "http://localhost:3000/calendar"
    }

    userEvents = fetch('http://localhost:5000/showEvents', {
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
          return JSON.stringify(events);
      });
  
    printEvents = async () => {
    const output = await this.userEvents;
    //console.log(output);
    return output;
    };

    // events(){
    //     console.log("test")
    //     var data = {
    //         uid: sessionStorage.getItem("uid"),
    //         date: sessionStorage.getItem("date"),
    //     };

    //     fetch('http://localhost:5000/showEvents', {
    //         method: 'POST',
    //         mode: 'cors',
    //         headers: {
    //           'Content-Type': 'application/json;charset=utf-8',
    //           'Access-Control-Allow-Origin': '*',
    //         },
    //         body: JSON.stringify(data)
    //       })

    //        .then(response => {
    //           if(response.status === 200){
    //               console.log("response is 200")
    //               return response.json()
    //           }
    //       })
    //       .then((events) => {
    //           sessionStorage.setItem("events", JSON.stringify(events))
    //           console.log(events);
    //       });                 
    // }
}