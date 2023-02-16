import { Fragment } from "react";
import BlockUi from 'react-block-ui';

const DynamicDataTable = ({ propertyNames, dataList, loading }) => {
  return (
    <Fragment>
      {dataList.length ? (
        <div>
          <BlockUi tag="div" blocking={loading} message="Loading..." keepInView>
            <table className="table table-hover table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  {propertyNames.map((item) => (
                    <th scope="col" key={item}>
                      {item}
                    </th>
                  ))}
                  <th scope="col" style={{ width: 130 }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((item, i) => (
                  <tr key={item._id}>
                    <th scope="row">{i + 1}</th>
                    {propertyNames.map((pn) => (
                      <td key={"pn_" + pn}>{item[pn]}</td>
                    ))}
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
