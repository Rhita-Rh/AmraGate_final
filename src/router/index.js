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
import ProjectsItem from '../views/ProjectsItem.vue';
import UpdateProject from '../views/UpdateProject.vue';
import FeedBackView from '@/views/FeedBackView.vue';
import followers from '../components/followers.vue';
import following from '../components/following1.vue';
import UserDetails from '../components/userdetails.vue';
import Forgot from '../views/Forgot.vue';
import Starred from "../views/Starred.vue";
import NotFound from '../views/NotFound.vue';

const routes = [
  {
    path: '/Home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/accounts/:id',
    name: 'UserDetails',
    component: UserDetails,
    props: true, // Allows route params to be passed as props
  },
  {
    path: '/followers',
    name: 'followers',
    component: followers
  },
  {
    path: '/following',
    name: 'following',
    component: following
  },
  {
    path: '/feedback',
    name: 'FeedBackView',
    component: FeedBackView
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
    path:'/Forgot',
    name:'Forgot',
    component: Forgot
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
  },
  {
    path: '/project/:id',
    name: 'ProjectDetails',
    component: ProjectsItem
  },
  {
    path: '/update-project/:id',
    name: "UpdateProject",
    component: UpdateProject
  },
  {
    path: "/starred",
    name: "Starred",
    component: Starred
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
