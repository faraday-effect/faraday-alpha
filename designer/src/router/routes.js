const routes = [
  {
    path: "/",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index") },
      { path: "design", component: () => import("pages/Designer") },
      { path: "quiz", component: () => import("pages/Quiz") },
      { path: "quiz-designer", component: () => import("pages/QuizDesigner") }
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
