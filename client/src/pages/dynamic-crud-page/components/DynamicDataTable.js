import { Fragment } from "react";
import BlockUi from "react-block-ui";

const DynamicDataTable = ({ propertyNames, dataList, loading }) => {
  return (
    <Fragment>
      {dataList.length ? (
        <div style={{ overflow: "auto" }}>
          <BlockUi tag="div" blocking={loading} message="Loading..." keepInView>
            <table className="table table-hover table-bordered">
              <thead className="thead-dark">
                <tr>
                  {/* <th scope="col">#</th> */}
                  <th scope="col" style={{ width: 130 }}>
                    Actions
                  </th>
                  {propertyNames.map((item) => (
                    <th scope="col" key={item.key}>
                      {item.key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataList.map((item, i) => (
                  <tr key={item._id}>
                    {/* <th scope="row">{i + 1}</th> */}
                    <td>
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary mr-2 ml-2"
                        >
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button type="button" className="btn btn-sm btn-danger">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                    {propertyNames.map((pn) => (
                      <td key={"pn_" + pn.key}>
                        {pn.type === "Array"
                          ? item[pn.key].length
                          : pn.type === "ObjectId"
                          ? item[pn.key]._id || item[pn.key]
                          : item[pn.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </BlockUi>
        </div>
      ) : null}
    </Fragment>
  );
};

export default DynamicDataTable;
