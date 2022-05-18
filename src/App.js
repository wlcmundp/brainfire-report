import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import EditReport from "./pages/EditReport";
import ReportsList from "./pages/ReportsList";
import CreateReport from "./pages/CreateReport";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/admin">
          <Route exact path="/admin" />
          <Route exact path="reports" element={<ReportsList />} />
          <Route exact path="add-new-report" element={<CreateReport />} />
          <Route exact path="edit-report/:id" element={<EditReport />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
