import React, { useState, useEffect, useRef, useCallback } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link } from "react-router-dom";
import BarometerGraphImage from "../assets/images/barometer-graph-image.png";
import Graph1 from "../assets/images/graph-1.png";
import Graph2 from "../assets/images/graph-2.png";
import Graph3 from "../assets/images/graph-3.png";
import Graph4 from "../assets/images/graph-4.png";
import Graph5 from "../assets/images/graph-5.png";
import axios from "axios";

import Dropdown from "react-bootstrap/Dropdown";
import { useAlert } from "react-alert";
import date from "date-and-time";

import MidSun from "./../assets/images/midsun.png";
import Cloudy from "./../assets/images/cloudy.png";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  TimeScale,
  TimeSeriesScale,
} from "chart.js";
import { createReactEditorJS } from "react-editor-js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { EDITOR_JS_TOOLS } from "./CONSTANT";
import CONFIG from "./../config";
import "chartjs-adapter-moment";
import { Line, Bar } from "react-chartjs-2";
import Sun from "./../assets/images/sun.png";
import Rainy from "./../assets/images/rainy.png";
import Goback from "../components/Goback";
import { Audio, Bars, Oval } from "react-loader-spinner";
import { Doughnut } from "react-chartjs-2";
import de from "date-and-time/locale/de";
const ReactEditorJS = createReactEditorJS();

ChartJS.register(
  // {
  //   id: "p1",
  //   beforeDraw: function (chart) {
  //     var ctx = chart.ctx;
  //     var chartArea = chart.chartArea;

  //     ctx.save();
  //     ctx.fillStyle = "#ffb0c1";
  //     ctx.fillRect(
  //       chartArea.left,
  //       chartArea.top + chartArea.height / 2,
  //       chartArea.right - chartArea.left,
  //       chartArea.bottom - chartArea.top - chartArea.height / 2
  //     );
  //     ctx.restore();
  //   },
  // },
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// import faker from "faker";
function CreateReport() {
  const alert = useAlert();
  date.locale(de); // => "en"
  const admin = useSelector((state) => state.login);
  let navigate = useNavigate();
  const [surveyList, setSurveyList] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState();

  // template list
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedTemplateLabel, setSelectedTemplateLabel] = useState("");
  const [templateList, setTemplateList] = useState([]);
  const [submittedStatus, setSubmittedStatus] = useState("publish");
  const [onceSubmitted, setOnceSubmitted] = useState(false);
  const editorRef = useRef();

  const setRef = (ref) => {
    editorRef.current = ref;
  };

  const handleChange = useCallback(async () => {
    const data = await editorRef.current.save();
    if (data) {
      console.log(data);
    }
  }, []);
  useEffect(() => {
    console.log("rerendering..");
    getSurvey();
    fetchTemplate();
    return () => {};
  }, []);
  const getSurvey = () => {
    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/surveys`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        setSurveyList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const fetchTemplate = () => {
    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/report-templates`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        setTemplateList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const updateTemplate = async () => {
    let save = await editorRef.current.save();
    var data = JSON.stringify({
      title: selectedTemplateLabel,
      comment: save,
    });

    var config = {
      method: "put",
      url: `${CONFIG.API_URL}/report-templates/${selectedTemplateId}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        alert.success("Template updated successfully");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const deleteTemplate = async () => {
    var config = {
      method: "delete",
      url: `${CONFIG.API_URL}/report-templates/${selectedTemplateId}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setTemplateList(
          templateList.filter((ele, index) => {
            if (ele.id !== response.data.id) {
              return true;
            }
            return false;
          })
        );
        // if (templateList.length > 0) {
        setSelectedTemplateId(null);
        // }
        alert.success("Template deleted successfully");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const saveTemplate = async () => {
    let save = await editorRef.current.save();
    var data = JSON.stringify({
      title: title + "-" + new Date().getTime(),
      comment: save,
    });

    var config = {
      method: "post",
      url: `${CONFIG.API_URL}/report-templates`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        alert.success("Template saved successfully");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addReport = (commentData) => {
    var axios = require("axios");
    var data = JSON.stringify({
      title: title,
      survey: selectedSurvey,
      comment: commentData,
      status: submittedStatus,
      user: admin.id,
    });

    var config = {
      method: "post",
      url: `${CONFIG.API_URL}/reports`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        navigate("/admin/reports");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <main className="main-section">
        <div className="container-fluid">
          {/* Title and Breadcrumbs Start */}
          <div className="mb-3 mb-md-4">
            <Goback />
            <h1 className="h3 mb-2 mb-md-1">Neuen Report hinzufügen</h1>
            <Breadcrumb className="cb-breadcrumb">
              <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item href="/admin/reports">Reports</Breadcrumb.Item>
              <Breadcrumb.Item active>Neuen Report hinzufügen</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          {/* Title and Breadcrumbs End */}

          <form
            className=""
            onSubmit={async (e) => {
              e.preventDefault();
              let data = await editorRef.current.save();
              if (selectedSurvey) {
                addReport(data);
              }
            }}
          >
            {/* Select Survey Start */}
            <div className="card cb-card mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title">Allgemeine Einstellungen</h2>
                <p className="card-subtitle">
                  Wählen Sie unten die Umfrage aus, um einen Report zu erstellen
                </p>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group cb-form-group mb-3 mb-md-4">
                      <label className="form-label">Report Titel</label>
                      <input
                        required
                        className="form-control"
                        placeholder="Enter report title"
                        type="text"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group cb-form-group mb-3 mb-md-4">
                      <label className="form-label">Umfrage</label>
                      <select
                        required
                        className="form-select"
                        placeholder="Select survey"
                        value={selectedSurvey}
                        onChange={(e) => {
                          setSelectedSurvey(e.target.value);
                        }}
                      >
                        <option value={null}>Umfrage auswählen</option>
                        {surveyList.map((ele, index) => {
                          return (
                            <option value={ele.id} key={index}>
                              {ele.lable}
                            </option>
                          );
                        })}
                      </select>
                      {onceSubmitted ? (
                        <>
                          {!selectedSurvey ? (
                            <span
                              className=""
                              style={{ marginLeft: 5, color: "red" }}
                            >
                              Required Field.
                            </span>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group cb-form-group">
                      <label className="form-label">Report-Template</label>
                      <select
                        className="form-select"
                        placeholder="Select template"
                        onChange={(e) => {
                          if (e.target.value !== "defautl") {
                            setSelectedTemplateId(
                              templateList[e.target.value].id
                            );
                            editorRef.current.render(
                              templateList[e.target.value].comment
                            );
                            setComment(templateList[e.target.value].comment);
                            setSelectedTemplateLabel(
                              templateList[e.target.value].label
                            );
                          } else {
                            setSelectedTemplateId("");
                            setComment([]);
                          }
                        }}
                      >
                        <option value="defautl" selected>
                          Template auswählen
                        </option>
                        {templateList.map((ele, index) => {
                          return <option value={index}>{ele.title}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {" "}
                    {!selectedTemplateId ? (
                      <button
                        className="btn btn-secondary btn-hover-effect me-2 me-md-3 btn-lg"
                        // disabled={question_list.length > 0 ? false : true}
                        onClick={(e) => {
                          e.preventDefault();
                          saveTemplate();
                        }}
                      >
                        Template speichern
                      </button>
                    ) : (
                      <Dropdown>
                        <Dropdown.Toggle>
                          <span className="btn-hover-effect me-2 me-md-3">
                            Template speichern
                          </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="user-dropdown">
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            // disabled={question_list.length > 0 ? false : true}
                            onClick={(e) => {
                              e.preventDefault();
                              saveTemplate();
                            }}
                          >
                            <span className="material-icons me-2">save</span>
                            Speichern unter
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={(e) => {
                              e.preventDefault();
                              updateTemplate();
                            }}
                          >
                            <span className="material-icons me-2">edit</span>
                            Aktualisieren
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="d-flex align-items-center"
                            onClick={(e) => {
                              e.preventDefault();
                              deleteTemplate();
                            }}
                          >
                            <span className="material-icons me-2">delete</span>
                            Löschen
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Select Survey End */}
            <SurveyPage
              setComment={setComment}
              setRef={setRef}
              handleChange={handleChange}
              comment={comment}
            />
            {/* <SurveyPage2 /> */}

            {/* Form Actions Start */}
            <div className="row align-items-center">
              <div className="col-md-6 mb-3 mb-md-0 order-md-2 d-md-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-secondary btn-hover-effect me-2 me-md-3 btn-lg"
                  onClick={async (e) => {
                    // e.preventDefault();
                    // let data = await editorRef.current.save();
                    // addReport(data, "draft");
                    setSubmittedStatus("draft");

                    setOnceSubmitted(true);
                  }}
                >
                  Entwurf speichern
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-raised btn-hover-effect btn-lg"
                  onClick={async (e) => {
                    // e.preventDefault();
                    // let data = await editorRef.current.save();
                    // addReport(data, "publish");
                    setSubmittedStatus("publish");
                    setOnceSubmitted(true);
                  }}
                >
                  Veröffentlichen
                </button>
              </div>
              <div className="col-md-6 order-md-1">
                <button className="btn btn-gray btn-hover-effect btn-lg">
                  Formular löschen
                </button>
              </div>
            </div>
            {/* Form Actions End */}
          </form>
        </div>
      </main>
    </div>
  );
}
const SurveyPage = ({ setComment, setRef, handleChange, comment }) => {
  const graph = useSelector((state) => state.graph);
  // const [xAxis, setXAxis] = useState(500);
  const [yAxisSun, setYAxisSun] = useState(100);
  const [yAxisRain, setyAxisRain] = useState(200);

  const [xAxisSun, setXAxisSun] = useState(500);
  const [xAxisRainy, setxAxisRainy] = useState(500);
  const [startInsight, setStartInsight] = useState({
    date: "",
    score: "",
  });
  const [endInsight, setEndInsight] = useState({
    date: "",
    score: "",
  });
  const editorCore = React.useRef(null);
  const chartRef = useRef(null);
  const [degree, setDegree] = useState(0);
  const [redraw, setRedraw] = useState(false);
  const handleInitialize = React.useCallback((instance) => {
    console.log(editorCore.current);
    editorCore.current = instance;
  }, []);

  useEffect(() => {
    if (graph.blue.real.length > 0) {
      console.log("undefined data", graph.blue.real);
      setInsight([
        { ...graph.blue.real[graph.blue.real.length - 2] },
        { ...graph.blue.real[graph.blue.real.length - 1] },
      ]);
    }
    return () => {};
  }, [graph.blue]);

  const setInsight = (data) => {
    setStartInsight({
      date: date.format(new Date(data[0].x), "MMMM, YYYY"),
      score: data[0].y,
    });
    setEndInsight({
      date: date.format(new Date(data[1].x), "MMMM, YYYY"),
      score: data[1].y,
    });
  };

  return (
    <div className="row">
      <div className="col-lg-6 d-flex">
        {/* Survey Result Start */}
        <div className="row">
          <div className="col-md-6 d-flex">
            <div className="card cb-card card-content-equal mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title mb-0">Überblick</h2>
              </div>
              <div className="card-body">
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
                              sminuxHeight = (20 / 100) * canvas.offsetWidth;
                            }

                            if (index === 2) {
                              sminuxWidht = (50 / 100) * canvas.offsetWidth;
                              sminuxHeight = (20 / 100) * canvas.offsetWidth;
                            }
                            if (index === 3) {
                              sminuxWidht = (70 / 100) * canvas.offsetWidth;
                              sminuxHeight = 0;
                            }
                            ctx.drawImage(
                              image,
                              (5 / 100) * canvas.offsetWidth + sminuxWidht,
                              (55 / 100) * canvas.offsetHeight - sminuxHeight,
                              imageSize,
                              imageSize
                            );
                            ctx.restore();
                          });
                          // let radianAngle =
                          //   (-e.config.data.datasets[0].needleValue * Math.PI) /
                          //   180;
                          // let radianAngle =
                          //   (-e.config.data.datasets[0].needleValue * Math.PI) /
                          //   100;
                          let radianAngle =
                            (-(100 - e.config.data.datasets[0].needleValue) *
                              Math.PI) /
                            100;
                          let radius = 180;
                          console.log(radianAngle);
                          var ctx = canvas.getContext("2d");

                          var cw = canvas.offsetWidth;
                          var ch = canvas.offsetHeight;
                          let cacl = canvas.offsetWidth;
                          var cx = cw / 2;
                          var cy = cacl - (25 / 100) * canvas.offsetHeight;

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
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card cb-card card-content-equal mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title mb-0">Insights</h2>
              </div>
              <div className="card-body">
                <p className="fs-14 text-muted mb-0">{startInsight.date}</p>
                <h6 className="mb-3">{startInsight.score}</h6>
                <p className="fs-14 text-muted mb-0">{endInsight.date}</p>
                <h6 className="mb-0">{endInsight.score}</h6>
              </div>
            </div>
          </div>
          <div className="col-md-12 d-flex">
            <div className="card cb-card card-content-equal mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title">Umfrageergebnis</h2>
                <p className="card-subtitle">
                  Überprüfen Sie die Grafik für jede Frage um den Report zu
                  veröffentlichen
                </p>
              </div>
              <div className="card-body">
                <div id="doubleLinechart">
                  <DoubleLineChart name="WW-Handel" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card cb-card card-content-equal mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title mb-0">
                  Handel Neuwagen (RM, WW, KW){" "}
                </h2>
              </div>
              <div className="card-body">
                <ThreeLineChart name="RM-Handel" slug="rm_handel" />
                {/* <LineChart name="WW-Handel" /> */}
                {/* <LineChart name="KW-Handel" /> */}
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card cb-card card-content-equal mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title mb-0">Handel Gebrauchtwagen</h2>
              </div>
              <div className="card-body">
                <LineChart name="GW-Handel" slug="gw_handel" />
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card cb-card card-content-equal mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title mb-0">Werkstatt</h2>
              </div>
              <div className="card-body">
                <LineChart name="Werkstatt" slug="werkstatt" />
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card cb-card card-content-equal mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title mb-0">Vermietung</h2>
              </div>
              <div className="card-body">
                <LineChart name="Vermietung" slug="vermietung" />
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card cb-card card-content-equal mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title mb-0">Shop</h2>
              </div>
              <div className="card-body">
                <LineChart name="Shop" slug="shop" />
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card cb-card card-content-equal mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title mb-0">Ergebnis</h2>
              </div>
              <div className="card-body">
                <LineChart name="Ergebnis" slug="ergebnis" />
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card cb-card card-content-equal mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title mb-0">Investitionen</h2>
              </div>
              <div className="card-body">
                <LineChart name="investitionen" slug="investitionen" />
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card cb-card card-content-equal mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title mb-0">Langfristiger Ausblick</h2>
              </div>
              <div className="card-body">
                <LineChart name="ausblick" slug="ausblick" />
              </div>
            </div>
          </div>
        </div>
        {/* Survey Result End */}
      </div>
      <div className="col-lg-6 d-flex">
        {/* Survey Comment Start */}
        <div className="card cb-card card-content-equal mb-3 mb-md-4">
          <div className="card-header card-header-border card-title-separator">
            <h2 className="h5 card-title">Report Kommentar</h2>
            <p className="card-subtitle">
              Verfassen Sie Ihren Kommentar für den Report
            </p>
          </div>
          <div className="card-body">
            {/* <h6>comment</h6> */}
            <div className="form-group cb-form-group write-result-comment-editor">
              <ReactEditorJS
                data={comment}
                // defaultValue={comment}
                // defaultValue={comment}
                onInitialize={(e) => {
                  setRef(e);
                }}
                onChange={handleChange}
                tools={EDITOR_JS_TOOLS}
                style={{ backgroundColor: "red" }}

                // value={(e) => {
                //   console.log(e);
                // }}
              />
              {/* <textarea
                type="text"
                className="form-control form-textarea"
                placeholder="Enter your comment"
              ></textarea> */}
            </div>
          </div>
        </div>
        {/* Survey Comment End */}
      </div>
    </div>
  );
};

const DoubleLineChart = ({}) => {
  const graph = useSelector((state) => state.graph);

  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });
  // const [data2, setData2] = useState([]);
  // const [labels2, setLabels2] = useState([]);
  // const [labels, setLabels] = useState([]);
  const [realData, setRealData] = useState([]);
  let chartRef = useRef(null);
  useEffect(() => {
    setRealData(graph.blue.real);

    setData({
      labels: graph.blue.labels,
      datasets: [
        {
          id: 1,
          label: "cm&p-Barometer",
          data: graph.blue.score,
          align: "center",
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
          borderColor: "blue",
          backgroundColor: "blue",
        },
        {
          id: 2,
          label: "Ifo-Geschäftsklima-Index",
          data: graph.red.score,
          align: "center",
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
          borderColor: "green",
          backgroundColor: "green",
        },
      ],
    });
  }, [graph]);

  if (graph.red.score.length < 1) {
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
      plugins={[
        {
          afterDraw: (e) => {
            let canvas = e.canvas;
            var ctx = e.ctx;
            ctx.save();
            let imagesUrl = [Rainy, Sun];

            imagesUrl.forEach((ele, index) => {
              var image = new Image();
              image.src = ele;
              let imageSize = (10 / 100) * canvas.offsetWidth;

              let sminuxWidht = 0;
              let sminuxHeight = 0;
              if (index === 1) {
                sminuxWidht = (20 / 100) * canvas.offsetWidth;
                sminuxHeight = (20 / 100) * canvas.offsetWidth;
              }

              ctx.drawImage(
                image,
                (39 / 100) * canvas.offsetWidth + sminuxWidht,
                (65 / 100) * canvas.offsetHeight - sminuxHeight,
                imageSize,
                imageSize
              );
              ctx.restore();
            });
          },
        },
      ]}
      options={{
        type: "line",

        data: data,
        legend: {
          display: false,
        },

        responsive: true,
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
            display: false,
            text: "name",
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
              maxTicksLimit: 6,
              maxRotation: 0,
              minRotation: 0,
            },
          },
        },
      }}
      data={data}
    />
  );
};

const ThreeLineChart = ({ name, slug }) => {
  const graph = useSelector((state) => state.graph);

  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });
  const [labels, setLabels] = useState([]);
  const [realData, setRealData] = useState([]);

  useEffect(() => {
    console.log(graph["rm_handel"], graph["ww_handel"], graph["kw_handel"]);
    setRealData(graph["rm_handel"].real);
    setData({
      labels: graph["rm_handel"].labels,
      datasets: [
        {
          id: 1,
          label: "RM-Handel",
          data: graph["rm_handel"].score,
          align: "center",
          barPercentage: 0.2,
          barThickness: 1,
          maxBarThickness: 2,
          minBarLength: 2,
          borderColor: "red",
          backgroundColor: "red",
        },
        {
          id: 2,
          label: "WW-Handel",
          data: graph["ww_handel"].score,
          align: "center",
          barPercentage: 0.2,
          barThickness: 1,
          maxBarThickness: 2,
          minBarLength: 2,
          borderColor: "green",
          backgroundColor: "green",
        },
        {
          id: 3,
          label: "KW-Handel",
          data: graph["kw_handel"].score,
          align: "center",
          barPercentage: 0.2,
          barThickness: 1,
          maxBarThickness: 2,
          minBarLength: 2,
          borderColor: "blue",
          backgroundColor: "blue",
        },
      ],
    });
  }, [graph]);
  if (graph["rm_handel"].score.length < 1) {
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
            display: false,
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
            type: "time",
            time: {
              unit: "month",
            },
            ticks: {
              maxTicksLimit: 4,
              maxRotation: 0,
              minRotation: 0,
              beginAtZero: true,
            },
          },
        },
      }}
      data={data}
    />
  );
};

const LineChart = ({ name, slug }) => {
  const graph = useSelector((state) => state.graph[slug]);

  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [realData, setRealData] = useState([]);

  useEffect(() => {
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
          display: true,
        },
        responsive: true,
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
            display: false,
            text: name,
          },
          tooltip: {
            usePointStyle: true,
            callbacks: {
              label: function (context) {
                // var label = context.dataset.label || "";
                let label = `${realData[context.dataIndex].x} ${
                  realData[context.dataIndex].y
                } ${name}`;

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
            type: "time",
            time: {
              unit: "month",
            },

            ticks: {
              maxTicksLimit: 4,
              maxRotation: 0,
              minRotation: 0,
              beginAtZero: true,
            },
          },
        },
      }}
      data={{
        labels: graph.labels,
        datasets: [
          {
            id: 1,
            label: "",
            data: graph.score,
            align: "center",
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      }}
    />
  );
};

const SurveyPage2 = ({}) => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [realData, setRealData] = useState([]);
  // useEffect(() => {
  //   const main = async () => {
  //     let resp = await axios.get("http://127.0.0.1:5000/report");
  //     let xAxis = [];
  //     let yAxis = [];
  //     let real = [];
  //     resp.data.Score.forEach((ele, index) => {
  //       yAxis.push(ele.y);
  //       xAxis.push(new Date(ele.x).getFullYear());
  //       real.push(ele);
  //     });
  //     setRealData(real);
  //     setData(yAxis);
  //     setLabels(xAxis);
  //   };
  //   main();
  //   return () => {};
  // }, []);
  return (
    <div className="row">
      <div className="col-lg-6 d-flex">
        {/* Survey Result Start */}
        <div className="card cb-card card-content-equal mb-3 mb-md-4">
          <div className="card-header card-header-border card-title-separator">
            <h2 className="h5 card-title">Umfrageergebnis</h2>
            <p className="card-subtitle">
              Überprüfen Sie die Grafik für jede Frage um den Report zu
              veröffentlichen
            </p>
          </div>
          <div className="card-body">
            <ul className="list-unstyled cb-list-group cb-bordered-list mb-3 survey-que-list">
              {/* Blank State */}
              <li className="cb-list-item d-none">
                <div className="blank-state-message">
                  <div className="cb-icon-avatar cb-icon-gray mb-3 cb-icon-72">
                    <span className="material-icons">info</span>
                  </div>
                  <h6 className="text-muted">
                    Wählen Sie eine der Umfragen von oben aus, um einen Report
                    zu erstellen.
                  </h6>
                </div>
              </li>

              <li className="cb-list-item">
                <h6>
                  Q1. Aus welchem Einzugsgebiet kommen mindestens 75 % Ihrer
                  Fahrzeugkäufer?
                </h6>
                <li className="cb-list-item">
                  <Bar
                    options={{
                      type: "line",

                      data: data,
                      legend: {
                        display: false,
                      },
                      responsive: true,
                      indexAxis: "y",
                      elements: {
                        point: {
                          radius: 0,
                        },
                      },
                      plugins: {
                        needle: false,
                        legend: {
                          position: "top",
                        },
                        title: {
                          display: true,
                          text: "name",
                        },
                        tooltip: {
                          usePointStyle: true,
                          callbacks: {
                            label: function (context) {
                              var label = context.dataset.label || "";
                              // let label = `${realData[context.dataIndex].x} ${
                              //   realData[context.dataIndex].y
                              // }`;

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
                        x: {
                          stacked: true,
                          categorySpacing: 0,
                        },
                        y: {
                          stacked: true,
                        },
                      },
                    }}
                    data={{
                      labels: [2021, 2022, 2023, 2024],
                      datasets: [
                        {
                          id: 1,
                          label: "data-1",
                          data: [70, 40, 50],
                          align: "center",
                          barPercentage: 0.5,
                          barThickness: 50,
                          maxBarThickness: 100,
                          minBarLength: 2,
                          borderColor: "rgb(255, 99, 132)",
                          backgroundColor: "green",
                        },
                        {
                          id: 2,
                          label: "data-2",
                          data: [30, 60, 50],
                          align: "center",
                          barPercentage: 0.5,
                          barThickness: 50,
                          maxBarThickness: 100,
                          minBarLength: 2,
                          borderColor: "rgb(255, 99, 132)",
                          backgroundColor: "red",
                        },
                        // {
                        //   id: 3,
                        //   label: "data-3",
                        //   data: [60, 60, 60, 40, 50],
                        //   align: "center",
                        //   barPercentage: 0.5,
                        //   barThickness: 50,
                        //   maxBarThickness: 100,
                        //   minBarLength: 2,
                        //   borderColor: "rgb(255, 99, 132)",
                        //   backgroundColor: "blue",
                        // },
                      ],
                    }}
                  />
                </li>
                {/* <img src={Graph1} alt="" className="img-fluid" /> */}
              </li>
              <li className="cb-list-item">
                <h6>
                  Q2. In welchen Abständen erhalten Sie von Ihren Herstellern
                  Daten über die Marktanteile Ihres Unternehmens?
                </h6>
                <img src={Graph2} alt="" className="img-fluid" />
              </li>
              <li className="cb-list-item">
                <h6>
                  Q3. Wie hoch ist der Fremdkundenanteil in Ihrer Werkstatt?
                </h6>
                <img src={Graph3} alt="" className="img-fluid" />
              </li>
              <li className="cb-list-item">
                <h6>
                  Q4. Wie hoch ist der Fremdkundenanteil in Ihrer Werkstatt?
                </h6>
                <img src={Graph4} alt="" className="img-fluid" />
              </li>
              <li className="cb-list-item">
                <h6>
                  Q5. Wie hoch ist der Fremdkundenanteil in Ihrer Werkstatt?
                </h6>
                <img src={Graph5} alt="" className="img-fluid" />
              </li>
            </ul>
          </div>
        </div>
        {/* Survey Result End */}
      </div>
      <div className="col-lg-6 d-flex">
        {/* Survey Comment Start */}
        <div className="card cb-card card-content-equal mb-3 mb-md-4">
          <div className="card-header card-header-border card-title-separator">
            <h2 className="h5 card-title">Report Kommentar</h2>
            <p className="card-subtitle">
              Verfassen Sie Ihren Kommentar für den Umfragebericht
            </p>
          </div>
          <div className="card-body">
            <h6>comment</h6>
            <div className="form-group cb-form-group">
              <textarea
                type="text"
                className="form-control form-textarea"
                placeholder="Ihren Kommentar eingeben"
              ></textarea>
            </div>
          </div>
        </div>
        {/* Survey Comment End */}
      </div>
    </div>
  );
};

export default CreateReport;
