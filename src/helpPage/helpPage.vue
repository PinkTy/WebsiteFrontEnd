<template>
  <div style="position: relative; top: -50px;">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <img alt="venuePage" v-bind="{width: 35, height: 35}" style="float:left" class="ml-1 mr-2" :src="require('../assets/help.png')">
      <b-navbar-brand class="ml-2">Help</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav tabs>
          <b-nav-item right
                      @click="switchPage('/')">
            Homepage
          </b-nav-item>
        </b-nav>
      </b-navbar-nav>

      <b-navbar-nav>
        <b-nav tabs>
          <b-nav-item @click="switchPage('/venues')">
            Find Venue
          </b-nav-item>
        </b-nav>
      </b-navbar-nav>

      <b-img alt="user"
             v-bind="{width: 35, height: 35}"
             rounded="circle"
             v-if="is_default==true && $cookies.get('is_login') == 'true'"
             :src="require('../assets/default.png')"/>
      <b-img alt="user"
             v-bind="{width: 35, height: 35}"
             rounded="circle"
             v-if="is_default==false && $cookies.get('is_login') == 'true'"
             :src="img_src_string"/>

      <b-navbar-nav v-if="this.$cookies.get('is_login') == 'true'">
        <b-nav-item-dropdown right :text="user_username">
          <b-dropdown-item @click="switchPage('/users/' + $cookies.get('userId'))">Profile</b-dropdown-item>
          <b-dropdown-item @click="switchPage('/users/' + $cookies.get('userId') + '/myVenue')">My Venue</b-dropdown-item>
          <b-dropdown-item v-on:click="logout()">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>

    <h5 class="mt-4 ml-3" style="text-align: left"><strong>1. You can login or register from Homepage.</strong></h5>
    <b-row class="ml-2 mt-2">
    <b-img left
           style="width: 400px; height: 320px" :src="require('../assets/help5.png')">
    </b-img>
    </b-row>
    <h5 class="mt-1 ml-3" style="text-align: left">
      <strong>2. In the single venue detail page, both administrator and reviewers' name are clickable.</strong></h5>
    <h5 class="mt-1 ml-xl-4" style="text-align: left">
      <strong> You can click these links to see other users' information.</strong></h5>
    <b-row class="ml-2 mt-2">
      <b-img left
             style="width: 600px; height: 320px" :src="require('../assets/help1.png')">
      </b-img>
    </b-row>
    <h5 class="mt-1 ml-xl-4" style="text-align: left">
      <strong> 3.This button is used for open or hide the search bar.</strong></h5>
    <b-row class="ml-2 mt-2">
      <b-img left
             style="width: 300px; height: 200px" :src="require('../assets/help3.png')">
      </b-img>
    </b-row>
    <h5 class="mt-1 ml-xl-4" style="text-align: left">
      <strong> 4.In the My Venue page, this button to add a new venue.</strong></h5>
    <b-row class="ml-2 mt-2">
      <b-img left
             style="width: 500px; height: 100px" :src="require('../assets/help4.png')">
      </b-img>
    </b-row>
    <h5 class="mt-1 ml-xl-4" style="text-align: left">
      <strong> 5.When you upload a new pic for venue, switch on this button to set upload picture to primary.</strong></h5>
    <b-row class="ml-2 mt-2">
      <b-img left
             style="width: 300px; height: 240px" :src="require('../assets/help2.png')">
      </b-img>
    </b-row>
    <h5 class="mt-1 ml-xl-4" style="text-align: left">
      <strong> 6.Click change password to set a new password, click change information can set your new family name and given name.</strong></h5>
  </div>
</template>

<script>
    export default {
      name: "helpPage",
      data(){
          return{
            is_default: true,
            img_src_string:"",
            user_username: ""
          }
      },
      mounted: function(){
        this.getUserPhoto();
        this.loadUserOwnName();
      },
      methods: {
        getUserPhoto: function () {
          this.$http.get('http://127.0.0.1:4941/api/v1/users/'+ this.$cookies.get('userId') +'/photo')
            .then(function (response) {
              this.img_src_string = 'http://127.0.0.1:4941/api/v1/users/'+ this.$cookies.get('userId') +'/photo';
              this.is_default = false;
            },function (error) {
              if(error.status==404){
                this.is_default = true;
              }
            })
        },
        loadUserOwnName: function(){
          this.$http.get('http://127.0.0.1:4941/api/v1/users/'+ this.$cookies.get('userId'))
            .then(function(response){
              this.user_username = response.data.username;
            }, function (error) {
              this.error = error;
            })
        },
      }
    }
</script>

<style scoped>

</style>
