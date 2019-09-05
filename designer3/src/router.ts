import Vue from "vue";
import Router from "vue-router";
import Home from "./pages/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      name: "about",
      path: "/about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./pages/About.vue")
    },
    {
      name: "calendar",
      path: "/calendar",
      component: () =>
        import(/* webpackChunkName: "calendar" */ "./pages/Calendar.vue")
    },
    {
      name: "home",
      path: "/",
      component: Home
    },
    {
      name: "schedule",
      path: "/schedule",
      component: () =>
        import(/* webpackChunkName: "schedule" */ "./pages/Schedule.vue")
    }
  ]
});
