import VueRouter from "vue-router";
import Vue from 'vue'
import Index from '@/view/Index'
import User from '@/view/User'
import Carousel from '@/view/Carousel'
import Activity from '@/view/Activity'
Vue.use(VueRouter)
const routes = [
    {
        path:'/',
        component:Index
    },
    {
        path:'/user',
        component:User
    },
    {
        path:'/carousel',
        component:Carousel
    },
    {
        path:'/activity',
        component:Activity
    }
]
export const router = new VueRouter({
    routes
})