import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import UpdateProfile from '../components/UpdateProfile.vue'
import Edit_comp from '../components/Edit_comp.vue'; 
import Signup from '../views/Signup.vue';
import Signin from '../views/Signin.vue';
import AjouterComp from '../views/AjouterComp.vue';
import AddProject from '../views/AddProject.vue';
import HomeView from '../views/HomeView.vue';
import accounts from '../components/accounts.vue';
import Edit_goal from '../components/Edit_goal.vue';
import mycomp from '../components/mycomp.vue'
import MyProjects from '../views/MyProjects.vue'

const routes = [
  {
    path: '/Home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/accounts',
    name: 'accounts',
    component: accounts
  },
  {
    path: "/signin", 
    name: "Signin",
    component: Signin
  },
  {
    path: "/signup", 
    name: "Signup",
    component: Signup
  },
  {
    path: '/Dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/UpdateProfile',
    name: 'UpdateProfile',
    component: UpdateProfile
  },
  { path: '/', name: 'Signin', component: Signin },
  {path: '/signup', name:'Signup',component: Signup},
  {
    path: '/Edit_comp/:userId/:index',
    name: 'Edit_comp',
    props: true,
    meta: { requiresAuth: true },
    component: Edit_comp
  },
  {
    path:'/my-projects',
    name:'MyProjects',
    component: MyProjects
  },
  {
    path:'/AjouterComp',
    name:'AjouterComp',
    component: AjouterComp
  },
  {
    path: '/add-project',
    name: "AddProject", 
    component: AddProject
  },
  {
    path: '/Edit_goal/:index',
    name: 'Edit_goal',
    component: () => import('../components/Edit_goal.vue'),
    props: route => ({ index: parseInt(route.params.index) }), 
    component: Edit_goal
  },
  {
    path: '/mycomp',
    name: 'mycomp',
    component: mycomp,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
