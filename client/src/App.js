import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Jokes from "./pages/Jokes";
import NoPage from "./pages/NoPage";
import DynamicPage from "./pages/dynamic-crud-page";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="jokes" element={<Jokes />} />
          <Route path="dynamic-page/:apiName" element={<DynamicPage />} />
        </Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}
