import { RouteConfig } from "vue-router";

const routes: RouteConfig[] = [
  {
    path: "/",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      {
        name: "designer",
        path: "design",
        component: () => import("pages/Designer.vue")
      },
      { path: "quiz", component: () => import("pages/Quiz.vue") },
      {
        path: "quiz-designer",
        component: () => import("pages/QuizDesigner.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
