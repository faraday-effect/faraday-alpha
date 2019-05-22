import { RouteConfig } from "vue-router";

const routes: RouteConfig[] = [
  {
    path: "/",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      {
        name: "home",
        path: "",
        component: () => import("pages/Index.vue")
      },
      {
        name: "content-designer",
        path: "content",
        component: () => import("pages/Designer.vue")
      },
      {
        name: "quiz",
        path: "quiz",
        component: () => import("pages/Quiz.vue")
      },
      {
        name: "quiz-designer",
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
