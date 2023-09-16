import { Fragment } from "react";
import BlockUi from "react-block-ui";
import moment from "moment";

const DynamicDataTable = ({
  propertyNames,
  dataList,
  loading,
  modelFields,
}) => {
  console.log("propertyNames", propertyNames);

  function getModelField(pn) {
    const result =
      modelFields?.length &&
      modelFields.find((mf) => mf.model === pn.ref)?.field;
    return result;
  }

  function renderObjectIdField(pn, item) {
    return getModelField(pn) && typeof item[pn.key] === "object"
      ? item[pn.key]?.[getModelField(pn)]
      : item[pn.key]?._id || item[pn.key];
  }

  function renderDateField(item, pn) {
    return item[pn.key]
      ? moment(item[pn.key]).format("DD.MM.YYYY HH:mm:ss")
      : item[pn.key];
  }

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
                          : pn.type === "Date"
                          ? renderDateField(item, pn)
                          : pn.type === "ObjectID"
                          ? renderObjectIdField(pn, item)
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
