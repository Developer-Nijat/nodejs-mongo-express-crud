import { Fragment } from "react";

const DynamicDetailsPage = () => {
  const arrayPath = window.location.pathname.split("/");
  const apiName = arrayPath[2];
  const id = arrayPath[4];
  return (
    <Fragment>
      <div className="container">
        <h1 style={{ textAlign: "center", marginTop: 10 }}>
          Dynamic Details Page
        </h1>
        <div>{JSON.stringify({ apiName, id })}</div>
      </div>
    </Fragment>
  );
};

export default DynamicDetailsPage;
