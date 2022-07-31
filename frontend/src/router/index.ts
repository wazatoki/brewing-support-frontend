import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import BrewingRecord from "@/views/BrewingRecord.vue";
import MasterUnit from "@/views/MasterUnit.vue";
import MasterIngredient from "@/views/MasterIngredient.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/brewing-record",
    name: "BrewingRecord",
    component: BrewingRecord,
  },
  {
    path: "/master-unit",
    name: "unitMaster",
    component: MasterUnit,
  },
  {
    path: "/master-ingredient",
    name: "ingredientMaster",
    component: MasterIngredient,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
