import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      name: "about",
      path: "/about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      name: "calendar",
      path: "/calendar",
      component: () =>
        import(/* webpackChunkName: "calendar" */ "./views/Calendar.vue")
    },
    {
      name: "home",
      path: "/",
      component: Home
    }
  ]
});
