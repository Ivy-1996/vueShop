import Vue from "vue"
import VueRouter from "vue-router"
import Login from "../components/Login"
import Home from "../components/Home"
import Welcome from "../components/Welcome"
import Users from "../components/user/Users"
import Rights from "../components/power/Rights"
import Roles from "../components/power/Roles"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home,
    children: [
      {
        path: "/welcome",
        component: Welcome
      },
      {
        path: "/users",
        component: Users
      },
      {
        path: "/rights",
        component: Rights
      },
      {
        path: "/roles",
        component: Roles
      }
    ],
    redirect: "/welcome"
  }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, form, next) => {
  if (to.path === "/login") {
    return next()
  }
  const token = window.sessionStorage.getItem("token")
  if (!token) {
    return next("/login")
  }
  next()
})

export default router
