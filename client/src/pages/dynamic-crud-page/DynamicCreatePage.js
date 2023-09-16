import { Fragment } from "react";

const DynamicCreatePage = () => {
  const arrayPath = window.location.pathname.split("/");
  const apiName = arrayPath[2];
  return (
    <Fragment>
      <div className="container">
        <h1 style={{ textAlign: "center", marginTop: 10 }}>
          Dynamic Create Page
        </h1>
        <div>{JSON.stringify(apiName)}</div>
      </div>
    </Fragment>
  );
};

export default DynamicCreatePage;
