import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { modelData } from "../../utils/constants";
import DynamicDataTable from "./components/DynamicDataTable";
import DynamicPagination from "./components/DynamicPagination";

const DynamicPage = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { apiName } = useParams();
  const modelObj = modelData[apiName];

  const [loading, setLoading] = useState(false);
  const [modelSchema, setModelSchema] = useState({});
  const [propertyNames, setPropertyNames] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [paginationData, setPaginationData] = useState({
    _start: 0,
    _limit: 5,
    _sort: "createdAt:desc",
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchModelSchema();
  }, []);

  async function fetchModelSchema() {
    try {
      if (!modelObj?.apiName || !modelObj?.modelName) {
        setAlertMessage("Model name or API name not found");
        return;
      }
      setAlertMessage("");
      setLoading(true);
      const res = (
        await axios.get(`${backendUrl}/schema/get/${modelObj.modelName}`)
      ).data;
      if (res?.data) {
        setModelSchema(res.data);
        const { _id, __v, ...rest } = res.data;
        const objKeys = Object.keys(rest);
        setPropertyNames(objKeys);
        fetchData(modelObj);
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      setLoading(false);
      console.log("fetchModelSchema error: ", error);
    }
  }

  async function fetchData(paginate) {
    try {
      setLoading(true);
      const res = (
        await axios.get(`${backendUrl}/api/v1/${modelObj.apiName}`, {
          params: paginate || paginationData,
        })
      ).data;
      if (res?.result) {
        setDataList(res.result);
        setTotal(res.count);
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      setLoading(false);
      console.log("fetchData error: ", error);
    }
  }

  const handlePageClick = (event) => {
    const newOffset = (event.selected * paginationData._limit) % total;
    const updatedPagination = { ...paginationData, _start: newOffset };
    setPaginationData(updatedPagination);
    fetchData(updatedPagination);
  };

  const handleLimitClick = (event) => {
    const _limit = Number(event.target.value);
    const updatedPagination = { ...paginationData, _limit };
    setPaginationData(updatedPagination);
    fetchData(updatedPagination);
  };

  return (
    <Fragment>
      <div className="container">
        {alertMessage && (
          <h1
            style={{
              textAlign: "center",
              color: "darkred",
              fontWeight: "bold",
            }}
          >
            {alertMessage}
          </h1>
        )}
        <DynamicDataTable
          dataList={dataList}
          propertyNames={propertyNames}
          loading={loading}
        />
        <DynamicPagination
          loading={loading}
          total={total}
          itemsPerPage={paginationData._limit}
          handlePageClick={handlePageClick}
          handleLimitClick={handleLimitClick}
        />
      </div>
    </Fragment>
  );
};

export default DynamicPage;
