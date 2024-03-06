import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Line, Pie, Radar, Doughnut } from "react-chartjs-2";
import { getRandomColor } from "../utils/helpers";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartTypes = ["Pie", "Bar", "Radar", "Line", "HorizontalBar", "Doughnut"];

const DynamicGroupBy = ({
  dateFilter,
  type,
  collectionName,
  nestedCollectionName,
  groupByKey,
  groupByChildKey,
  title,
  // chartType maybe prop or use state
}) => {
  const [loading, setLoading] = useState(false);
  // const [chartType, setChartType] = useState("Pie")
  const [chartData, setChartData] = useState({
    labels: ["-"],
    datasets: [
      {
        data: [1],
        backgroundColor: ["#f7f7f7"],
      },
    ],
  });
  const [startDate, setStartDate] = useState(
    moment(new Date()).utc(true).add(-1, "year").toDate()
  );
  const [endDate, setEndDate] = useState(moment(new Date()).utc(true).toDate());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (start, end) => {
    try {
      setLoading(true);

      if (!collectionName || !groupByKey) {
        console.log(
          "fetchData failed: collectionName and groupByKey are required"
        );
        return;
      }

      let filter = {
        collectionName,
        groupByKey,
      };

      if (nestedCollectionName && groupByChildKey) {
        filter = {
          ...filter,
          nestedCollectionName,
          groupByChildKey,
        };
      }

      if (dateFilter !== "not") {
        let sDate = start || startDate;
        let eDate = end || endDate;

        if (sDate) {
          filter.createdAt_gte = `${moment(sDate).format(
            "YYYY-MM-DD"
          )}T00:00:00`;
        } else {
          filter.createdAt_gte = `${moment(sDate)
            .add(-1, "day")
            .format("YYYY-MM-DD")}T00:00:00`;
        }

        if (eDate) {
          filter.createdAt_lt = `${moment(eDate).format(
            "YYYY-MM-DD"
          )}T00:00:00`;
        }
      }

      const dynamicApiName =
        type === "nested" ? "group-by/nested" : "group-by/single";

      const { data } = await axios.post(
        `http://localhost:4000/${dynamicApiName}`,
        filter
      );

      if (Array.isArray(data?.result)) {
        let mappedResult = data.result
          .filter((x) => x._id)
          .map((item) => {
            let obj = {};
            if (item._id) {
              obj.key = item._id;
            }
            if (item.count) {
              obj.count = item.count;
            }
            return obj;
          });

        let chartObj = {
          labels: ["-"],
          datasets: [
            {
              data: [1],
              backgroundColor: ["#f7f7f7"],
            },
          ],
        };

        let labelList = [];
        let dataCount = [];
        let backgroundColor = [];

        if (mappedResult && mappedResult.length > 0) {
          mappedResult.forEach((element) => {
            let randomColor = getRandomColor();
            labelList.push(element.key);
            dataCount.push(element.count);
            backgroundColor.push(randomColor);
          });

          chartObj.labels = labelList;
          chartObj.datasets = [
            {
              label: "",
              data: dataCount,
              backgroundColor: backgroundColor,
            },
          ];
        }

        setChartData(chartObj);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("fetchData error: ", error);
    }
  };

  const handleStartDateChange = (e) => {
    const { value } = e.target;
    setStartDate(value);
    fetchData(value);
  };

  const handleEndDateChange = (e) => {
    const { value } = e.target;
    setEndDate(value);
    fetchData(null, value);
  };

  return (
    <div className="col-md-3">
      {loading && <progress style={{ width: "100%" }} />}
      <h3>{title}</h3>
      <div className="row">
        <div className="col-sm-6">
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="col-sm-6">
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>
      <div className="row">
        {/* {
          chartType === "Pie" ? <Pie data={chartData} /> : <Doughnut data={chartData} />
        } */}
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default DynamicGroupBy;
