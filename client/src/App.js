import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Jokes from "./pages/Jokes";
import NoPage from "./pages/NoPage";
import DynamicPage from "./pages/dynamic-crud-page";
import DynamicCreatePage from "./pages/dynamic-crud-page/DynamicCreatePage";
import DynamicUpdatePage from "./pages/dynamic-crud-page/DynamicUpdatePage";
import DynamicDetailsPage from "./pages/dynamic-crud-page/DynamicDetailsPage";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="jokes" element={<Jokes />} />
          <Route path="dynamic-page/:apiName" element={<DynamicPage />} />
          <Route
            path="dynamic-page/:apiName/create"
            element={<DynamicCreatePage />}
          />
          <Route
            path="dynamic-page/:apiName/update/:id"
            element={<DynamicUpdatePage />}
          />
          <Route
            path="dynamic-page/:apiName/details/:id"
            element={<DynamicDetailsPage />}
          />
        </Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}
