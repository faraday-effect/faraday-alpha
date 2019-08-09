import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Calendar from "./views/Calendar.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      name: "about",
      path: "/about",
      component: About
    },
    {
      name: "calendar",
      path: "/calendar",
      component: Calendar
    },
    {
      name: "home",
      path: "/",
      component: Home
    }
  ]
});
