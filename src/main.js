import Vue from 'vue'
import App from './App.vue'
import Home from "./Home.vue";
import Venues from "./venue/Venue"
import User from "./user/User"
import MyVenue from "./user/MyVenue"
import addVenue from "./user/addVenue"
import UpdateVenue from "./user/UpdateVenue"
import HomePageLoading from "./loadingPage/HomePageLoading"
import reviewPostLoading from "./loadingPage/reviewPostLoading"
import ProfileLoading from "./loadingPage/ProfileLoading"
import updateVenuePicture from "./user/updateVenuePicture";
import venuePicLoading from "./loadingPage/venuePicLoading";
import helpPage from  "./helpPage/helpPage"

import VueRouter from 'vue-router'
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueCookies from 'vue-cookies';
Vue.use(VueCookies);

//set expire time for 7 days
VueCookies.config('7d');

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path:"/loading",
    name:"HomePageLoading",
    component:HomePageLoading
  },
  {
    path:"/reviewLoading",
    name:"reviewPageLoading",
    component:reviewPostLoading
  },
  {
    path:"/profileLoading",
    name:"ProfileLoading",
    component:ProfileLoading
  },
  {
    path:"/venuePhotoLoading",
    name:"venuePicLoading",
    component:venuePicLoading
  },
  {
    path: "/venues",
    name:"venue_homepage",
    component: Venues
  },
  {
    path: "/venues/:venueId",
    name:"venue",
    component: Venues
  },
  {
    path: "/users/:userId",
    name:"users",
    component: User
  },
  {
    path: "/users/:userId/myVenue",
    name:"myVenue",
    component: MyVenue
  },
  {
    path: "/users/:userId/addVenue",
    name:"addVenue",
    component: addVenue
  },
  {
    path: "/users/:userId/updateVenue/:venueId",
    name: "updateVenue",
    component: UpdateVenue
  },
  {
    path: "/users/:userId/updateVenuePic/:venueId",
    name: "updateVenuePicture",
    component: updateVenuePicture
  },
  {
    path: "/help",
    name:"helpPage",
    component:helpPage
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});
Vue.mixin({
  methods:{
    /**
     * global function, jump to another page
     * @param url
     */
    switchPage: function (url) {
      this.$router.push(url)
    },
    /**
     * global function, user use token to logout,
     * if token is invalid, user still cannot still login
     */
    logout: function(){
      this.$http.post('http://127.0.0.1:4941/api/v1/users/logout',null,
        {headers: {'X-Authorization': this.$cookies.get('token')}})
        .then(function (response) {
          this.$cookies.set("is_login", 'false');
          this.$cookies.set("userId", "");
          this.$cookies.set("token", "");
          this.switchPage("/loading")
        },function (error) {
          if(error.status=="401"){
            alert("Connection expire, cannot stay login anymore!")
            this.$cookies.set("is_login", 'false');
            this.$cookies.set("userId", "");
            this.$cookies.set("token", "");
            this.switchPage("/loading")
          }
        })
    }
  }  
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
