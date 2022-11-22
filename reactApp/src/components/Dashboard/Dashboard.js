import React, { Component } from "react";
import { Line } from "react-chartjs-2";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  componentDidMount() {
    var currentUrl = window.location.href;
    let url = new URL(currentUrl);
    let params = new URLSearchParams(url.search.slice(1));
    for (let pair of params.entries()) {
      sessionStorage.setItem(pair[0], pair[1]);
    }
  }

  render() {
    const data = {
      labels: [
        "01-12-2020",
        "02-12-2020",
        "03-12-2020",
        "04-12-2020",
        "05-12-2020",
      ],
      datasets: [
        {
          label: "Created",
          data: [30, 2, 1, 2, 1],
          backgroundColor: ["rgb(0, 0, 255)"],
          pointBackgroundColor: ["rgb(0, 0, 255)"],
          pointBorderColor: ["rgb(0, 0, 255)"],
        },
        {
          label: "Closed",
          data: [3, 50, 1, 2, 1],
          backgroundColor: ["rgb(60, 179, 113)"],
          pointBackgroundColor: ["rgb(60, 179, 113)"],
          pointBorderColor: ["rgb(60, 179, 113)"],
        },
        {
          label: "Reopened",
          data: [3, 21, 1, 21, 1],
          backgroundColor: ["rgb(255, 0, 0)"],
          pointBackgroundColor: ["rgb(255, 0, 0)"],
          pointBorderColor: ["rgb(255, 0, 0)"],
        },
        {
          label: "Assigned",
          data: [32, 100, 1, 2, 1],
          backgroundColor: ["rgb(255, 165, 0)"],
          pointBackgroundColor: ["rgb(255, 165, 0)"],
          pointBorderColor: ["rgb(255, 165, 0)"],
        },
        {
          label: "Transferred",
          data: [3, 88, 1, 22, 1],
          backgroundColor: ["rgb(106, 90, 205)"],
          pointBackgroundColor: ["rgb(106, 90, 205)"],
          pointBorderColor: ["rgb(106, 90, 205)"],
        },
        {
          label: "Overdue",
          data: [55, 2, 12, 2, 1],
          backgroundColor: ["rgb(238, 130, 238)"],
          pointBackgroundColor: ["rgb(238, 130, 238)"],
          pointBorderColor: ["rgb(238, 130, 238)"],
        },
      ],
    };
    const options = {
      title: {
        display: true,
        text: "Tickets Activity",
      },
      scales: {
        yAxes: [
          {
            ticks: {
              min: 0,
              max: 175,
              stepSize: 15,
            },
          },
        ],
      },
    };
    return (
      <div>
        <Line data={data} options={options}></Line>;
      </div>
    );
  }
}

export default Dashboard;
