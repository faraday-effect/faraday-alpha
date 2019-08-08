import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import Calendar from "@/views/Calendar.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      name: "about",
      path: "/about",
      component: About
      // This kind of dynamic loading hoses up browser-side debugging.
      // component: () =>
      //   import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      name: "calendar",
      path: "/calendar",
      component: Calendar
      // component: () =>
      //   import(/* webpackChunkName: "calendar" */ "./views/Calendar.vue")
    },
    {
      name: "home",
      path: "/",
      component: Home
    }
  ]
});
