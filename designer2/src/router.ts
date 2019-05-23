import Vue from "vue";
import Router from "vue-router";
import Home from "./pages/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/quiz-preview",
      name: "quiz-preview",
      component: () => import("./pages/Quiz.vue")
    },
    {
      path: "/about",
      name: "about",
      component: () => import("./pages/About.vue")
    }
  ]
});
