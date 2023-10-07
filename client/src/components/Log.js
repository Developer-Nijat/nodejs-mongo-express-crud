import { Fragment, useEffect, useState } from "react";
import { Table } from "reactstrap";

function LogComponent() {
  const [tableData, setTableData] = useState({ headers: [], logs: [] });

  useEffect(() => {
    // Fetch log data from the API
    fetch("http://localhost:4000/log/list")
      .then((response) => response.json())
      .then((data) => setTableData(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <Fragment>
      <h4 className="mt-4" style={{ color: "lightgray" }}>
        Log Table
      </h4>
      <Table responsive size="sm" dark bordered style={{ fontSize: 12 }}>
        <thead>
          <tr>
            {tableData.headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.logs.map((log, index) => (
            <tr key={index}>
              {tableData.headers.map((header, index) => (
                <td key={index}>{log[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  );
}

export default LogComponent;
