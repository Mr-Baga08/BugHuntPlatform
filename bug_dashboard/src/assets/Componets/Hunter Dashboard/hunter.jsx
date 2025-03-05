import React, { useState, useEffect } from "react";
import TaskDisplayView from "../../../App/Common/Container/TaskDisplay/TaskDisplayView";
import Navbar from "../../../App/Common/Container/Appbar/NavBar";

export default function Hunter() {
  return (
  <div>
    <TaskDisplayView title={'Project Management Dashboard'}/>
  </div>);
}
