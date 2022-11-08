import React, { Fragment, useEffect, useState } from "react";
import {
  Col,
  Row,
  Button,
  FormGroup,
  Input,
  Table,
  FormText,
} from "reactstrap";
import { read, utils } from "xlsx";
import axios from "axios";

import "./App.css";

const requiredFields = ["ID", "Title", "Content", "Category"];

function App() {
  const [loading, setLoading] = useState(false);
  const [excelRows, setExcelRows] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = (await axios.get("http://localhost:4000/api/v1/jokes"))
        .data;
      setRows(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json(worksheet);
        setExcelRows(json);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const uploadData = async () => {
    try {
      setLoading(true);

      const firstItemKeys = excelRows[0] && Object.keys(excelRows[0]);

      let requiredValidation = false;

      if (firstItemKeys.length) {
        requiredFields.forEach((element) => {
          if (!firstItemKeys.find((x) => x === element)) {
            requiredValidation = true;
          }
        });
      }

      if (requiredValidation) {
        alert("Required fields " + JSON.stringify(requiredFields));
        setLoading(false);
        return;
      }

      const jokesResponse = (
        await axios.get("http://localhost:4000/api/v1/jokes")
      ).data;
      const jokeList = jokesResponse || [];

      const jokes = excelRows.map((obj) => ({
        _id: jokeList.find((x) => x.jokeId == obj["ID"])?._id,
        jokeId: obj["ID"] || "",
        title: obj["Title"] || "",
        content: obj["Content"] || "",
        category: obj["Category"] || "",
      }));

      const updatedJokes = jokes.filter((x) => x._id);
      const newJokes = jokes.filter((x) => !x._id);

      if (updatedJokes.length) {
        const result = (
          await axios.post(
            "http://localhost:4000/bulk/jokes-bulk-update",
            updatedJokes
          )
        ).data;

        if (result) {
          alert("Successfully updated " + updatedJokes.length + " documents");
        }
      }

      if (newJokes.length) {
        const result = (
          await axios.post(
            "http://localhost:4000/bulk/jokes-bulk-insert",
            newJokes
          )
        ).data;

        if (result) {
          alert("Successfully added " + newJokes.length + " documents");
        }
      }

      fetchData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("uploadData error: ", error);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setExcelRows([]);
    window.location.reload();
  };

  function renderDataTable() {
    return (
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>Category</th>
            <th>CreatedAt</th>
            <th>UpdatedAt</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, idx) => (
            <tr key={idx}>
              <th scope="row">{item.jokeId}</th>
              <td>{item.title}</td>
              <td>{item.content}</td>
              <td>{item.category}</td>
              <td>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : ""}
              </td>
              <td>
                {item.updatedAt
                  ? new Date(item.updatedAt).toLocaleString()
                  : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return (
    <Fragment>
      <h3 className="text-center mt-4 mb-4">
        NodeJs & React. Multi Insert and Multi Update from Excel document
      </h3>
      <div className="container">
        <Row>
          <Col md="6 text-left">
            <FormGroup>
              <Input
                id="inputEmpGroupFile"
                name="file"
                type="file"
                onChange={readUploadFile}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
              <FormText>
                {
                  "NOTE: The headers in the Excel file should be as follows!. => "
                }
                {requiredFields.join(", ")}
              </FormText>
            </FormGroup>
          </Col>
          <Col md="6 text-left">
            {selectedFile?.name && (
              <Button disabled={loading} color="success" onClick={uploadData}>
                {"Upload data"}
              </Button>
            )}{" "}
            {selectedFile?.name && (
              <Button disabled={loading} color="danger" onClick={removeFile}>
                {"Remove file"}
              </Button>
            )}
          </Col>
        </Row>
        {loading && <progress style={{ width: "100%" }}></progress>}
        <h4 className="mt-4" style={{ color: "lightgray" }}>
          Jokes Table
        </h4>
        <button onClick={fetchData}>Refresh</button>
        {renderDataTable()}
      </div>
    </Fragment>
  );
}

export default App;
