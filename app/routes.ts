import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("workout", "routes/workout.tsx"),
  route("groceries", "routes/groceries.tsx"),
] satisfies RouteConfig;
