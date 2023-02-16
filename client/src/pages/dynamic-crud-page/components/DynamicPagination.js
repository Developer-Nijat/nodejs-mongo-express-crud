import { Fragment } from "react";
import ReactPaginate from "react-paginate";

const DynamicPagination = ({
  loading,
  total,
  itemsPerPage,
  handlePageClick,
  handleLimitClick,
}) => {
  const pageCount = Math.ceil(total / itemsPerPage);
  return (
    <Fragment>
      {total && total !== 0 ? (
        <div className="row">
          {/* {loading ? (
            <progress style={{ width: "100%" }} className="mb-2" />
          ) : (
            <hr style={{ color: "lightgray" }} />
          )} */}
          <div className="col-2">
            <div className="form-group">
              <select
                className="form-control"
                value={itemsPerPage}
                onChange={handleLimitClick}
                disabled={loading}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
                <option value={500}>500</option>
              </select>
            </div>
          </div>
          <div className="col-2">
            <div className="form-group">
              <label>Total: {total}</label>
            </div>
          </div>
          <div className="col-8">
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="< previous"
              renderOnZeroPageCount={null}
              activeClassName="active"
              breakClassName="page-item"
              pageClassName={"page-item"}
              breakLinkClassName="page-link"
              nextLinkClassName={"page-link"}
              pageLinkClassName={"page-link"}
              nextClassName={"page-item next"}
              previousLinkClassName={"page-link"}
              previousClassName={"page-item prev"}
              containerClassName={
                "pagination react-paginate justify-content-end p-1"
              }
            />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default DynamicPagination;
