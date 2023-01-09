import react, { Component } from "react";
import { createWorker } from "tesseract.js";
import "./App.css";
import Chart from "react-apexcharts";
import Tesseract from "tesseract.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      imageText: "",
      processing: false,
      showChartButton: false,
      showChart: false,
      valueNotClear: "",
      options: {
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: [
            "Bilrubin total",
            "Bilrubin Direct",
            "Bilrubin Indirect",
            "S.G.O.T",
            "S.G.P.T",
            "Alkaline Phosphatase",
            "Total Proteins",
            "Albumin",
            "Globulin",
            "A/G Ratio",
            "GGTP",
          ],
        },
      },
      series: null,
    };
  }

  handleFileUpload = (e) => {
    this.setState({ image: URL.createObjectURL(e.target.files[0]) });
  };

  extraxtTextFromImage = () => {
    Tesseract.recognize(this.state.image, "eng", {
      logger: (m) => {
        this.setState({ processing: true });
      },
    }).then(({ data: { text } }) => {
      this.setState({
        imageText: text,
        processing: false,
        showChartButton: true,
      });
      console.log(text);
    });
  };

  generateChart = () => {
    const text = this.state.imageText;
    console.log("Rohan-text", text);
    this.setState({ showChart: true });
    let BT = text.match(/Bilirubin Total\s\d+\.?\d*/);
    let BD = text.match(/Bilirubin Direct\s\d+\.?\d*/);
    let BI = text.match(/Bilirubin Indirect\s\d+\.?\d*/);
    let SGOT = text.match(/S\.?G\.?O\.?T\.?\s\d+\.?\d*/);
    let SGPT = text.match(/S\.?G\.?P\.?T\.?\s\d+\.?\d*/);
    let AP = text.match(/Alkaline Phosphatase\s\d+\.?\d*/);
    let TP = text.match(/Total Proteins\s\d+\.?\d*/);
    let A = text.match(/Albumin\s\d+\.?\d*/);
    let G = text.match(/Globulin\s\d+\.?\d*/);
    let AG = text.match(/A\/\s?G\sRatio\s\d+\.?\d*/);
    let GGTP = text.match(/GGTP\s\d+\.?\d*/);
    //let dataTexts = [BT[0], BD[0], BI[0], SGOT[0], SGPT[0], AP[0], TP[0], A[0], G[0], AG[0], GGPT[0]];
    let dataTexts = [];
    console.log(
      BT +
        " " +
        BD +
        " " +
        BI +
        " " +
        SGOT +
        " " +
        SGPT +
        " " +
        AP +
        " " +
        TP +
        " " +
        A +
        " " +
        G +
        " " +
        AG +
        " " +
        GGTP
    );

    let valueNotClear = "";

    if (BT != null) {
      dataTexts.push(BT[0]);
    } else {
      valueNotClear += "BT" + " ";
      dataTexts.push("");
    }
    if (BD != null) {
      dataTexts.push(BD[0]);
    } else {
      valueNotClear += "BD ";
      dataTexts.push("");
    }
    if (BI != null) {
      dataTexts.push(BI[0]);
    } else {
      valueNotClear += "BI ";
      dataTexts.push("");
    }
    if (SGOT != null) {
      dataTexts.push(SGOT[0]);
    } else {
      valueNotClear += "SGOT ";
      dataTexts.push("");
    }
    if (AP != null) {
      dataTexts.push(AP[0]);
    } else {
      valueNotClear += "AP ";
      dataTexts.push("");
    }
    if (TP != null) {
      dataTexts.push(TP[0]);
    } else {
      valueNotClear += "TP ";
      dataTexts.push("");
    }
    if (A != null) {
      dataTexts.push(A[0]);
    } else {
      valueNotClear += "A ";
      dataTexts.push("");
    }
    if (G != null) {
      dataTexts.push(G[0]);
    } else {
      valueNotClear += "G ";
      dataTexts.push("");
    }
    if (GGTP != null) {
      dataTexts.push(GGTP[0]);
    } else {
      valueNotClear += "GGTP ";
      dataTexts.push("");
    }

    let data = [];
    for (let i = 0; i < dataTexts.length; i++) {
      if (dataTexts[i] != "") {
        console.log(dataTexts[i]);
        let arrData = dataTexts[i].split(" ");
        console.log(arrData);
        let val = arrData[arrData.length - 1];
        data.push(val);
      } else {
        data.push(0);
      }
    }

    this.setState({
      series: [
        {
          name: "series-1",
          data: data,
        },
      ],
      valueNotClear: valueNotClear,
    });
  };

  render() {
    return (
      <>
        {this.state.processing && <div>Processing</div>}
        <input
          ref="fileInput"
          onChange={this.handleFileUpload}
          type="file"
          style={{ display: "none" }}
        />
        <button onClick={() => this.refs.fileInput.click()}>Upload File</button>
        <img src={this.state.image} width="200" height="200" />
        <button onClick={() => this.extraxtTextFromImage()}>
          Extract Text From Image
        </button>
        {this.state.showChartButton && (
          <>
            <div>{this.state.imageText}</div>
            <button onClick={() => this.generateChart()}>Generate chart</button>
          </>
        )}
        {this.state.showChart && (
          <>
            <div className="row">
              <div className="mixed-chart">
                <Chart
                  options={this.state.options}
                  series={this.state.series}
                  type="line"
                  width="1000"
                />
              </div>
            </div>
            <div>
              {this.state.valueNotClear} values are not clear from Image.
            </div>
          </>
        )}
      </>
    );
  }
}
export default App;

{
  /* <button onClick={generateChart(ocrText)}>Generate chart</button>
        <div className="row">
          <div className="mixed-chart">
          <Chart
            options={options}
            series={series}
            type="line"
            width="500"
          />
          </div>
        </div>  */
}
