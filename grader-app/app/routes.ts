import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/code/:challenge/*", "routes/api.code.$challenge.$.ts"),
  route("api/grades", "routes/api.grades.ts")
] satisfies RouteConfig;
