import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import Table from "react-bootstrap/Table";
import BarometerGraphImage from "../assets/images/barometer-graph-image.png";
import GraphImage from "../assets/images/graph-image.png";
import { useSelector } from "react-redux";
import CONFIG from "./../config";
import axios from "axios";
import "./../../node_modules/react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  TimeScale,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import "chartjs-adapter-moment";
import { Audio, Bars, Oval } from "react-loader-spinner";
import Sun from "./../assets/images/sun.png";
import Rainy from "./../assets/images/rainy.png";
import MidSun from "./../assets/images/midsun.png";
import Cloudy from "./../assets/images/cloudy.png";
import Goback from "../components/Goback";
import GraphInit from "../actions/graphs";

let width, height, gradient;

ChartJS.register(
  ArcElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  TimeScale
);

function ReportsList() {
  const admin = useSelector((state) => state.login);
  const graph = useSelector((state) => state.graph);

  const chartRef = useRef(null);

  const [show, setShow] = useState(false);
  const [reportList, setReportList] = useState([]);
  const [seletectReport, setSeletectReport] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [backgroundColor, setbackgroundColor] = useState([]);
  const [degree, setDegree] = useState(0);
  const [redraw, setRedraw] = useState(false);
  const [developemntIncreasement, setDevelopemntIncreasement] = useState("");
  const [climateIncreasement, setClimateIncreasement] = useState("");
  useEffect(() => {
    getAllReport();
    return () => {};
  }, []);

  const deleteSurvey = () => {
    var config = {
      method: "delete",
      url: `${CONFIG.API_URL}/reports/${seletectReport}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        let data = [];
        reportList.forEach((ele, index) => {
          if (ele.id !== seletectReport) {
            data.push(ele);
          }
        });
        handleClose();
        setReportList(data);
        alert.success("Report deleted successfully");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getAllReport = () => {
    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/reports`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        setReportList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <GraphInit />
      <main className="main-section">
        <div className="container-fluid">
          {/* Title, Breadcrumbs and Add Button Start */}
          <div className="row mb-3 mb-md-4">
            <div className="col-md-8">
              <Goback />
              <h1 className="h3 mb-2 mb-md-1">Reports</h1>
              <Breadcrumb className="cb-breadcrumb">
                <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Reports</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="col-md-4 d-md-flex align-items-center justify-content-end">
              <Link
                to="/admin/add-new-report"
                className="btn btn-primary btn-icon-text btn-raised btn-hover-effect"
              >
                <span className="material-icons me-2">add</span>
                <span className="link-text">Neuen Report hinzufügen</span>
              </Link>
            </div>
          </div>
          {/* Title, Breadcrumbs and Add Button End */}

          {/* Report graph overview start */}
          <div className="row">
            <div className="col-lg-4 col-md-6 d-flex">
              {/* Barometer Score Card Start */}
              <div className="card cb-card card-content-equal mb-3 mb-md-4">
                <div className="card-header card-header-border card-title-separator">
                  <h2 className="h5 card-title">Aktuelle Barometer-Score</h2>
                  <p className="card-subtitle">
                    Barometer-Befragungsergebnisse
                  </p>
                </div>
                <div className="card-body" style={{ position: "relative" }}>
                  {/* <img src={BarometerGraphImage} alt="" className="img-fluid" /> */}
                  {/* <canvas id="oilChart" height="80"></canvas> */}
                  {/* <img
                    src={Rainy}
                    style={{
                      position: "absolute",
                      bottom: 75,
                      left: 5,
                      width: 50,
                    }}
                  /> */}
                  <div>
                    {!graph.guage_angle ? (
                      <Oval
                        color="#17325c"
                        secondaryColor="#ffb0c1"
                        ariaLabel="loading-indicator"
                        height={100}
                        width={100}
                        strokeWidth={5}
                        wrapperStyle={{
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      />
                    ) : (
                      <Doughnut
                        ref={chartRef}
                        plugins={[
                          {
                            beforeTooltipDraw: (e) => {
                              let canvas = e.canvas;
                              var ctx = e.ctx;
                              ctx.save();

                              let imagesUrl = [Rainy, Cloudy, MidSun, Sun];

                              imagesUrl.forEach((ele, index) => {
                                var image = new Image();
                                image.src = ele;
                                let imageSize = (18 / 100) * canvas.offsetWidth;
                                console.log(imageSize);

                                let sminuxWidht = 0;
                                let sminuxHeight = 0;
                                if (index === 1) {
                                  sminuxWidht = (20 / 100) * canvas.offsetWidth;
                                  sminuxHeight =
                                    (20 / 100) * canvas.offsetWidth;
                                }

                                if (index === 2) {
                                  sminuxWidht = (50 / 100) * canvas.offsetWidth;
                                  sminuxHeight =
                                    (20 / 100) * canvas.offsetWidth;
                                }
                                if (index === 3) {
                                  sminuxWidht = (70 / 100) * canvas.offsetWidth;
                                  sminuxHeight = 0;
                                }
                                ctx.drawImage(
                                  image,
                                  (5 / 100) * canvas.offsetWidth + sminuxWidht,
                                  (55 / 100) * canvas.offsetHeight -
                                    sminuxHeight,
                                  imageSize,
                                  imageSize
                                );
                                ctx.restore();
                              });
                              // let radianAngle =
                              //   (-e.config.data.datasets[0].needleValue *
                              //     Math.PI) /
                              //   180;
                              let radianAngle =
                                (-(
                                  100 - e.config.data.datasets[0].needleValue
                                ) *
                                  Math.PI) /
                                100;
                              let radius = 180;

                              var ctx = canvas.getContext("2d");

                              var cw = canvas.offsetWidth;
                              var ch = canvas.offsetHeight;
                              let cacl = canvas.offsetWidth;
                              var cx = cw / 2;
                              var cy = cacl - (20 / 100) * canvas.offsetHeight;

                              ctx.translate(cx, cy);
                              ctx.rotate(radianAngle);
                              ctx.beginPath();
                              ctx.moveTo(0, -5);
                              ctx.lineTo(radius, 0);
                              ctx.lineTo(0, 5);
                              ctx.fillStyle = "rgba(0, 76, 0, 0.8)";
                              ctx.fill();
                              ctx.rotate(-radianAngle);
                              ctx.translate(-cx, -cy);
                              ctx.beginPath();
                              ctx.arc(cx, cy, 7, 0, Math.PI * 2);
                              ctx.fill();
                            },
                          },
                        ]}
                        options={{
                          type: "doughnut",
                          // maintainAspectRatio: true,
                          responsive: true,
                          plugins: {
                            needle: (e) => {
                              console.log(e);
                            },
                            p1: false,
                            title: {
                              display: false,
                              text: "name",
                            },
                            legend: {
                              display: false,
                            },
                            tooltip: {
                              usePointStyle: true,

                              callbacks: {
                                label: function (context) {
                                  var label = context.dataset.label || "";
                                  if (context) {
                                  }

                                  return context.label;
                                },
                                labelColor: function (context) {
                                  let color = "red";
                                  if (context.label === "sehr pessimistisch") {
                                    color = "#6ba4da";
                                  }
                                  if (context.label === "etwas pessimistisch") {
                                    color = "#cbe0f2";
                                  }

                                  if (context.label === "etwas optimistisch") {
                                    color = "#feeba7";
                                  }
                                  if (context.label === "sehr optimistisch") {
                                    color = "#ffc928";
                                  }
                                  return {
                                    borderColor: color,
                                    backgroundColor: color,
                                    borderWidth: 2,
                                    borderDash: [2, 2],
                                    borderRadius: 2,
                                    zIndex: 100,
                                  };
                                },
                                labelTextColor: function (context) {
                                  return "#fff";
                                },
                              },
                            },
                          },
                        }}
                        data={{
                          labels: [
                            "sehr pessimistisch",
                            "etwas pessimistisch",
                            "etwas optimistisch",
                            "sehr optimistisch",
                          ],

                          datasets: [
                            {
                              needleValue: graph.guage_angle,
                              // needleValue: 24,
                              circumference: 180,
                              rotation: 270,
                              data: [45, 45, 45, 45],
                              fill: "start",
                              backgroundColor: [
                                "#6ba4da",
                                "#cbe0f2",
                                "#feeba7",
                                "#ffc928",
                              ],

                              borderWidth: 0,
                            },
                          ],
                        }}
                      />
                    )}
                  </div>
                  {/* <img
                    src={Sun}
                    style={{
                      position: "absolute",
                      bottom: 90,
                      right: 5,
                      width: 50,
                    }}
                  /> */}
                </div>
              </div>
              {/* Barometer Score Card End */}
            </div>
            <div className="col-lg-4 col-md-6 d-flex">
              {/* Historic Development Score Card Start */}
              <div className="card cb-card card-content-equal mb-3 mb-md-4">
                <div className="card-header card-header-border card-title-separator">
                  <h2 className="h5 card-title">
                    Historische Entwicklung Score
                  </h2>
                  <div className="card-subtitle d-flex align-items-center ">
                    <div
                      className="d-flex align-items-center text-success"
                      style={{
                        color:
                          developemntIncreasement > 0
                            ? "green !important"
                            : "red !important",
                      }}
                    >
                      {developemntIncreasement}
                      {developemntIncreasement > 0 ? (
                        <span
                          className="material-icons ms-1 me-1"
                          style={{ color: "green" }}
                        >
                          trending_up
                        </span>
                      ) : (
                        <span
                          className="material-icons ms-1 me-1"
                          style={{ color: "red" }}
                        >
                          trending_down
                        </span>
                      )}
                    </div>
                    {developemntIncreasement > 0 ? "Increase" : "Decrease"} in
                    diesen Monat
                  </div>
                </div>
                <div className="card-body">
                  <LineChart
                    name=""
                    setDevelopemntIncreasement={setDevelopemntIncreasement}
                  />
                </div>
              </div>
              {/* Historic Development Score Card End */}
            </div>
            <div className="col-lg-4 col-md-12 d-flex">
              {/* IFO Business Climate Index Card Start */}
              <div className="card cb-card card-content-equal mb-3 mb-md-4">
                <div className="card-header card-header-border card-title-separator">
                  <h2 className="h5 card-title">IFO-Geschäftsklima-Index</h2>
                  <div className="card-subtitle d-flex align-items-center">
                    <div
                      className="d-flex align-items-center text-danger"
                      style={{
                        color:
                          climateIncreasement > 0
                            ? "green !important"
                            : "red !important",
                      }}
                    >
                      {climateIncreasement}
                      {climateIncreasement > 0 ? (
                        <span
                          className="material-icons ms-1 me-1"
                          style={{ color: "green" }}
                        >
                          trending_up
                        </span>
                      ) : (
                        <span
                          className="material-icons ms-1 me-1"
                          style={{ color: "red" }}
                        >
                          trending_down
                        </span>
                      )}
                    </div>
                    {climateIncreasement > 0 ? "Increase" : "Decrease"} in
                    diesen Monat
                  </div>
                </div>
                <div className="card-body">
                  <LineChart2
                    name=""
                    setClimateIncreasement={setClimateIncreasement}
                  />
                </div>
              </div>
              {/* IFO Business Climate Index Card End */}
            </div>
          </div>
          {/* Report graph overview start */}

          {/* Report List Table Start */}
          <div className="card cb-card overflow-hidden">
            <Table className="cb-table mb-0">
              <thead>
                <tr>
                  <th>
                    <div className="d-flex align-items-center">
                      Title{" "}
                      <span className="material-icons ms-1">unfold_more</span>
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center">
                      Status{" "}
                      <span className="material-icons ms-1">unfold_more</span>
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center">Aktionen </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportList.map((ele, index) => {
                  return (
                    <tr>
                      <td data-title="Title" className="table-col-title">
                        <div className="d-flex align-items-start cb-list-item">
                          <div className="cb-icon-avatar cb-icon-secondary me-2 me-md-3">
                            {ele.title[0] + ele.title[1]}
                          </div>
                          <div>
                            <Link
                              to={`/admin/edit-report/${ele.id}`}
                              state={{ data: ele }}
                            >
                              <h6 className="mb-1">{ele.title}</h6>
                            </Link>
                            <p className="card-subtitle">
                              {ele.survey.round ? ele.survey.round : 0} rounds
                            </p>
                          </div>
                        </div>
                      </td>
                      <td data-title="Status" className="table-col-xs-50">
                        {ele.status === "publish" ? (
                          <Badge
                            bg="success"
                            className="cb-badge badge-open-round"
                          >
                            Veröffentlicht
                          </Badge>
                        ) : (
                          <Badge
                            bg="primary"
                            className="cb-badge badge-open-round"
                          >
                            Entwurf
                          </Badge>
                        )}
                      </td>

                      <td data-title="Actions" className="table-col-actions">
                        <Link
                          to={`/admin/edit-report/${ele.id}`}
                          state={{ data: ele }}
                        >
                          <button
                            className="btn-fab btn-secondary btn-hover-effect me-3"
                            title="Edit"
                          >
                            <span className="material-icons">edit</span>
                          </button>
                        </Link>
                        <button
                          className="btn-fab btn-danger btn-hover-effect"
                          onClick={(e) => {
                            e.preventDefault();
                            handleShow();
                            setSeletectReport(ele.id);
                          }}
                          title="Delete"
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          {/* Report List Table End */}
        </div>

        {/* Delete Report Popup Start */}
        <Modal
          show={show}
          onHide={handleClose}
          className="cb-modal thank-you-modal delete-modal"
          centered
        >
          <Modal.Header className="justify-content-center" closeButton>
            <div className="cb-icon-avatar cb-icon-danger cb-icon-72">
              <span className="material-icons">delete</span>
            </div>
          </Modal.Header>
          <Modal.Body className="text-center">
            <h4>Delete Report</h4>
            <p className="mb-0">
              Sind Sie sicher, dass Sie diesen Report löschen wollen? Dieser
              Vorgang lässt sich nicht rückgängig gemacht werden.
            </p>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <button
              className="btn btn-gray btn-raised btn-hover-effect me-3"
              onClick={handleClose}
            >
              Abbrechen
            </button>
            <button
              className="btn btn-danger btn-raised btn-hover-effect"
              onClick={() => {
                deleteSurvey(seletectReport);
              }}
            >
              Report löschen
            </button>
          </Modal.Footer>
        </Modal>
        {/* Delete Report Popup End */}
      </main>
    </div>
  );
}
const LineChart = ({ name, setDevelopemntIncreasement }) => {
  const graph = useSelector((state) => state.graph.blue);

  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [realData, setRealData] = useState([]);
  let chartRef = useRef(null);
  useEffect(() => {
    console.log(graph);
    setRealData(graph.real);
    return () => {};
  }, [graph]);

  if (graph.score.length < 1) {
    return (
      <Oval
        color="#17325c"
        secondaryColor="#ffb0c1"
        ariaLabel="loading-indicator"
        height={100}
        width={100}
        strokeWidth={5}
        wrapperStyle={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  return (
    <Line
      ref={chartRef}
      options={{
        type: "line",
        // responsive: true,

        data: data,
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          point: {
            radius: 3,
          },
        },
        plugins: {
          needle: false,
          legend: {
            display: false,
            position: "top",
          },
          title: {
            display: true,
            text: name,
          },
          tooltip: {
            usePointStyle: true,
            callbacks: {
              label: function (context) {
                // var label = context.dataset.label || "";
                let label = `${realData[context.dataIndex].x} ${
                  realData[context.dataIndex].y
                }`;

                return label;
              },
              labelColor: function (context) {
                return {
                  borderColor: "rgb(0, 0, 255)",
                  backgroundColor: "rgb(255, 0, 0)",
                  borderWidth: 2,
                  borderDash: [2, 2],
                  borderRadius: 2,
                };
              },
              labelTextColor: function (context) {
                return "#fff";
              },
            },
          },
        },
        scales: {
          y: {
            max: 100,
            min: 0,
          },
          x: {
            // max: 100,
            // min: 0,
            type: "time",
            time: {
              unit: "month",
            },
            ticks: {
              maxTicksLimit: 4,
              minTicksLimit: 2,
              maxRotation: 0,
              minRotation: 0,
            },
          },
        },
      }}
      data={{
        labels: graph.labels,
        datasets: [
          {
            id: 1,
            label: name,
            data: graph.score,
            align: "center",
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            borderColor: "blue",
            backgroundColor: "blue",
          },
        ],
      }}
    />
  );
};
const LineChart2 = ({ name, setClimateIncreasement }) => {
  const graph = useSelector((state) => state.graph.red);

  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [realData, setRealData] = useState([]);
  useEffect(() => {
    console.log("red", graph);
    setRealData(graph.real);
    return () => {};
  }, [graph]);

  if (graph.score.length < 1) {
    return (
      <Oval
        color="#17325c"
        secondaryColor="#ffb0c1"
        ariaLabel="loading-indicator"
        height={100}
        width={100}
        strokeWidth={5}
        wrapperStyle={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  return (
    <Line
      options={{
        type: "line",

        data: data,
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          point: {
            radius: 2,
          },
        },
        plugins: {
          needle: false,
          legend: {
            display: false,
            position: "top",
          },
          title: {
            display: true,
            text: name,
          },
          tooltip: {
            usePointStyle: true,
            callbacks: {
              label: function (context) {
                // var label = context.dataset.label || "";
                let label = `${realData[context.dataIndex].x} ${
                  context.dataset.data[context.dataIndex]
                } ${context.dataset.label}`;
                return label;
              },
              labelColor: function (context) {
                return {
                  borderColor: "rgb(0, 0, 255)",
                  backgroundColor: "rgb(255, 0, 0)",
                  borderWidth: 2,
                  borderDash: [2, 2],
                  borderRadius: 2,
                };
              },
              labelTextColor: function (context) {
                return "#fff";
              },
            },
          },
        },
        scales: {
          y: {
            max: 100,
            min: 0,
          },
          x: {
            // max: 100,
            // min: 0,
            type: "time",
            time: {
              unit: "month",
            },
            ticks: {
              maxTicksLimit: 4,
              minTicksLimit: 2,
              maxRotation: 0,
              minRotation: 0,
            },
          },
        },
      }}
      data={{
        labels: graph.labels,
        datasets: [
          {
            id: 1,
            label: name,
            data: graph.score,
            align: "center",
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            borderColor: "green",
            backgroundColor: "green",
          },
        ],
      }}
    />
  );
};

export default ReportsList;
