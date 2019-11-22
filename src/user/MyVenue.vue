<template>
  <div style="position: relative; top: -50px;">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <img alt="venuePage" v-bind="{width: 35, height: 35}" style="float:left" class="ml-1 mr-2" :src="require('../assets/myVenue.png')">
      <b-navbar-brand class="ml-2">My Venue</b-navbar-brand>

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

      <b-navbar-nav>
        <b-nav tabs>
          <b-nav-item right
                      @click="switchPage('/help')">
            Help
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

    <div v-if="$cookies.get('is_login') == 'true' && $cookies.get('userId') == $route.params.userId">
      <b-button id="add_venue"
                pill
                variant="dark"
                class="mt-2 mb-1 ml-3"
                style="float: left;"
                @click="switchPage('/users/'+$cookies.get('userId')+'/addVenue')">+</b-button>
      <b-tooltip target="add_venue" placement="right" title="Add a new venue"/>
      <b-card-group deck class="ml-md-2 mt-2" >
        <div v-for="venue in own_venue">
          <div v-if="venue.primaryPhoto == null">
            <b-card img-alt="Image"
                    img-top
                    img-height="300"
                    style="max-width: 20rem;"
                    bg-variant="light"
                    class="mb-md-2"
                    :img-src="require('../assets/default.png')">
              <b-card-title class="text-left"><strong>{{venue.venueName}}</strong></b-card-title>
              <b-card-sub-title class="text-left">{{venue.city}} |<b-badge class="ml-2" variant="dark">
                {{getCategoryById(venue.categoryId)}}
              </b-badge>
              </b-card-sub-title>
              <b-card-text class="text-left mt-2">
                <h6 v-if="venue.meanStarRating!=null">
                  <strong>Star rating: </strong>{{ venue.meanStarRating }}
                </h6>
                <h6 v-else>
                  <strong>Star rating: </strong>3
                </h6>
                <h6 v-if="venue.modeCostRating!=null">
                  <strong>Cost rating: </strong>{{ venue.modeCostRating }}
                </h6>
                <h6 v-else>
                  <strong>Cost rating: </strong>0
                </h6>
              </b-card-text>

              <b-button variant="dark"
                        size="sm"
                        v-on:click="switchPage('/users/'+$route.params.userId+'/updateVenue/'+venue.venueId)">
                Edit Information
              </b-button>
              <b-button variant="dark"
                        size="sm"
                        v-on:click="switchPage('/users/'+$route.params.userId+'/updateVenuePic/'+venue.venueId)">
                Edit Photo
              </b-button>
            </b-card>
          </div>

          <div v-else>
            <b-card img-alt="Image"
                    img-top
                    img-height="300"
                    style="max-width: 20rem;"
                    bg-variant="light"
                    class="mb-md-2"
                    :img-src="getImageUrl(venue.venueId, venue.primaryPhoto)">
              <b-card-title class="text-left"><strong>{{venue.venueName}}</strong></b-card-title>
              <b-card-sub-title class="text-left">{{venue.city}} |<b-badge class="ml-2" variant="dark">
                {{getCategoryById(venue.categoryId)}}
              </b-badge>
              </b-card-sub-title>
              <b-card-text class="text-left mt-2">
                <h6 v-if="venue.meanStarRating!=null">
                  <strong>Star rating: </strong>{{ venue.meanStarRating }}
                </h6>
                <h6 v-else>
                  <strong>Star rating: </strong>3
                </h6>
                <h6 v-if="venue.modeCostRating!=null">
                  <strong>Cost rating: </strong>{{ venue.modeCostRating }}
                </h6>
                <h6 v-else>
                  <strong>Cost rating: </strong>0
                </h6>
              </b-card-text>
              <b-button variant="dark"
                        size="sm"
                        v-on:click="switchPage('/users/'+$route.params.userId+'/updateVenue/'+venue.venueId)">
                Edit Information
              </b-button>
              <b-button variant="dark"
                        size="sm"
                        v-on:click="switchPage('/users/'+$route.params.userId+'/updateVenuePic/'+venue.venueId)">
                Edit Photo
              </b-button>
            </b-card>
          </div>
        </div>
      </b-card-group>
    </div>
  </div>
</template>

<script>
    export default {
      name: "MyVenue",
      data() {
        return{
          error: "",
          is_default: true,
          img_src_string:"",
          user_username: "",
          own_venue: [],
          all_category: []
        }
      },
      mounted: function(){
        this.loadOwnVenue();
        this.loadCategory();
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
        loadOwnVenue: function () {
          this.$http.get('http://127.0.0.1:4941/api/v1/venues?adminId=' + this.$route.params.userId)
            .then(function (response) {
              this.own_venue = response.data;
            }, function (error) {
              this.error = error;
            })
        },
        getImageUrl: function(imageId, imageName){
          return "http://127.0.0.1:4941/api/v1/venues/"+ imageId + "/photos/" + imageName;
        },
        loadCategory: function(){
          this.$http.get('http://127.0.0.1:4941/api/v1/categories')
            .then(function (response) {
              this.all_category = response.data;
            }, function (error) {
              this.error = error;
            })
        },
        getCategoryById: function (id) {
          for(let i = 0;i < this.all_category.length;i++){
            if(this.all_category[i].categoryId == id){
              return this.all_category[i].categoryName;
            }
          }

        }
      }

    }
</script>

<style scoped>

</style>
