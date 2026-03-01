import { createBrowserRouter } from "react-router";
import { Homepage } from "./components/Homepage";
import { Questionnaire } from "./components/Questionnaire";
import { Dashboard } from "./components/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Homepage,
  },
  {
    path: "/questionnaire",
    Component: Questionnaire,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
]);