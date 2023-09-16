import { Fragment } from "react";

const DynamicUpdatePage = () => {
  const arrayPath = window.location.pathname.split("/");
  const apiName = arrayPath[2];
  const id = arrayPath[4];
  return (
    <Fragment>
      <div className="container">
        <h1 style={{ textAlign: "center", marginTop: 10 }}>
          Dynamic Update Page
        </h1>
        <div>{JSON.stringify({ apiName, id })}</div>
      </div>
    </Fragment>
  );
};

export default DynamicUpdatePage;
