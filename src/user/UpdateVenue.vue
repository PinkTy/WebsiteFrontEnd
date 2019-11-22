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

    <div v-if="is_valid">
      <div v-if="start_loading">
        <br/><br/><br/><br/>
        <b-spinner label="Spinning"></b-spinner>
        <b-spinner type="grow" label="Spinning"></b-spinner>
      </div>
      <div v-else>
        <b-row>
          <b-button id="add_venue"
                    pill
                    variant="dark"
                    class="mt-2 mb-1 ml-4"
                    style="float: left;"
                    @click="backToMyVenue()"><</b-button>
          <b-tooltip target="add_venue" placement="right" title="Back to my venue"/>
        </b-row>
        <b-card bg-variant="light" class="w-50 ml-xl-5 mt-2">
          <b-form-group
            label-cols-lg="4"
            label="Update venue:"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="ml-1 text-left"
          >
            <b-form-group
              label-cols-sm="4"
              label="Venue name:"
              label-align-sm="right"
              label-for="venue-name"
              invalid-feedback="Can't be empty"
            >
              <b-form-input id="venue-name"
                            v-model="new_venue.venueName"
                            :value="new_venue.venueName"
                            :state="venue_name_state"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="Category:"
              label-align-sm="right"
              label-for="category"
              invalid-feedback="Please select a category"
            >
              <b-form-select v-model="new_venue.categoryId"
                             :options="categories"
                             :state="category_id_state"
                             :value="new_venue.categoryId">
                <template slot="first">
                  <option :value="null" disabled>Please select a category</option>
                </template>
              </b-form-select>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="City:"
              label-align-sm="right"
              label-for="city"
              invalid-feedback="Cannot be empty"
            >
              <b-form-input id="city"
                            v-model="new_venue.city"
                            :state="city_state"
                            :value="new_venue.city"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="Address:"
              label-align-sm="right"
              label-for="address"
              invalid-feedback="Cannot be empty"
            >
              <b-form-input id="address"
                            v-model="new_venue.address"
                            :state="address_state"
                            :value="new_venue.address"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="Latitude:"
              label-align-sm="right"
              label-for="latitude"
              invalid-feedback="Please provide valid latitude"
            >
              <b-form-input id="latitude"
                            v-model="new_venue.latitude"
                            :state="latitude_state"
                            :value="new_venue.latitude"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="Longitude:"
              label-align-sm="right"
              label-for="longitude"
              invalid-feedback="Please provide valid longitude"
            >
              <b-form-input id="longitude"
                            v-model="new_venue.longitude"
                            :state="longitude_state"
                            :value="new_venue.longitude"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="Short description:"
              label-align-sm="right"
              label-for="short-description"
              invalid-feedback="Cannot be empty"
            >
              <b-form-input id="short-description"
                            v-model="new_venue.shortDescription"
                            :state="short_description_state"
                            :value="new_venue.shortDescription"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="Long description:"
              label-align-sm="right"
              label-for="long-description"
            >
              <b-form-textarea
                id="long-description"
                v-model="new_venue.longDescription"
                :value="new_venue.longDescription"
                rows="5"
              ></b-form-textarea>
            </b-form-group>
          </b-form-group>
        </b-card>

        <b-button variant="danger"
                  class="mt-2 mr-2"
                  @click="cancel_push = !cancel_push">Cancel</b-button>
        <b-button variant="dark"
                  class="mt-2 mr-2" @click="handleVenue()">Submit</b-button>

        <b-modal v-model="cancel_push"
                 :header-bg-variant="modalBackground"
                 @ok="backToMyVenue()">
          <h4>Your venue information will not be saved!</h4>
        </b-modal>
      </div>

    </div>

  </div>
</template>

<script>
    export default {
      name: "UpdateVenue",
      data(){
        return{
          is_valid: false,
          modalBackground: 'light',
          is_default: true,
          img_src_string:"",
          user_username: "",

          cancel_push: false,
          categories:[],

          venue_name_state:null,
          category_id_state: null,
          city_state:null,
          short_description_state:null,
          long_description_state:null,
          address_state:null,
          latitude_state:null,
          longitude_state:null,
          start_loading: false,
          new_venue: {
            venueName: "",
            categoryId: null,
            city: "",
            shortDescription: "",
            longDescription: "",
            address: "",
            latitude: "",
            longitude: ""
          }
        }
      },
      mounted: function () {
        this.checkValid();
        this.loadCategory();
        this.getUserPhoto();
        this.loadUserOwnName();
        this.loadVenueInfo();
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
        loadCategory: function(){
          this.$http.get('http://127.0.0.1:4941/api/v1/categories')
            .then(function(response){
              for(let i = 0;i <  response.data.length;i++){
                this.categories.push({ value: response.data[i].categoryId, text: response.data[i].categoryName });
              }
            }, function(error){
              this.error = error;
              this.errorFlag = true;
            })
        },
        loadVenueInfo: function(){
          this.$http.get('http://127.0.0.1:4941/api/v1/venues/'+this.$route.params.venueId)
            .then(function (response) {
              this.new_venue.venueName = response.data.venueName;
              this.new_venue.categoryId = response.data.category.categoryId;
              this.new_venue.city = response.data.city;
              this.new_venue.address = response.data.address;
              this.new_venue.longitude = response.data.longitude;
              this.new_venue.latitude = response.data.latitude;
              this.new_venue.shortDescription = response.data.shortDescription;
              this.new_venue.longDescription = response.data.longDescription;
            }, function (error) {
              alert(error.status)
            })
        },
        checkValid: function () {
          if(this.$route.params.userId != this.$cookies.get('userId') || this.$cookies.get('is_login') != "true"){
            this.is_valid = false;
            return
          }
          this.checkWithServer(this.$cookies.get('userId'));

        },
        checkWithServer: function (id) {
          this.$http.get('http://127.0.0.1:4941/api/v1/venues?adminId=' + id)
            .then(function (response) {
              for(let i = 0;i < response.data.length; i++){
                if(response.data[i].venueId == this.$route.params.venueId){
                  this.is_valid = true;
                }
              }
            }, function (error) {
              alert(error.status)
            })
        },

        backToMyVenue: function(){
          this.is_valid = false;
          this.venue_name_state=null;
          this.category_id_state= null;
          this.city_state=null;
          this.short_description_state=null;
          this.long_description_state=null;
          this.address_state=null;
          this.latitude_state=null;
          this.longitude_state=null;

          this.start_loading = false;

          this.new_venue = {
            venueName: "",
            categoryId: null,
            city: "",
            shortDescription: "",
            longDescription: "",
            address: "",
            latitude: "",
            longitude: ""
          };
          this.switchPage('/users/'+this.$cookies.get('userId')+'/myVenue')
        },
        checkVenueName:function(){
          if(this.new_venue.venueName.length == 0){
            this.venue_name_state = "invalid"
          } else {
            this.venue_name_state = "valid"
          }
        },
        checkCategory: function(){
          if(this.new_venue.categoryId == null){
            this.category_id_state = "invalid"
          } else {
            this.category_id_state = "valid";
          }
        },
        checkCity: function(){
          if(this.new_venue.city.length == 0){
            this.city_state = "invalid"
          } else {
            this.city_state = "valid"
          }
        },
        checkAddress: function(){
          if(this.new_venue.address.length == 0){
            this.address_state = "invalid"
          } else {
            this.address_state = "valid"
          }
        },
        checkLatitude: function(){
          if(this.new_venue.latitude.length == 0){
            this.latitude_state = "invalid";
            return
          }
          if(isNaN(this.new_venue.latitude)){
            this.latitude_state = "invalid";
            return
          } else {
            if(parseFloat(this.new_venue.latitude) > 90 || parseFloat(this.new_venue.latitude) < -90){
              this.latitude_state = "invalid";
              return
            }
            this.latitude_state = "valid";
          }

        },
        checkLongitude: function(){
          if(this.new_venue.longitude.length == 0){
            this.longitude_state = "invalid";
            return
          }
          if(isNaN(this.new_venue.longitude)){
            this.longitude_state = "invalid";
            return
          } else {
            if(parseFloat(this.new_venue.longitude) > 180 || parseFloat(this.new_venue.longitude) < -180){
              this.longitude_state = "invalid";
              return
            }
            this.longitude_state = "valid";
          }
        },
        checkShortDescription: function(){
          if(this.new_venue.shortDescription.length == 0){
            this.short_description_state = "invalid"
          } else {
            this.short_description_state = "valid"
          }
        },
        handleVenue: function () {
          this.checkVenueName();
          if(this.venue_name_state == "invalid"){
            return
          }
          this.checkCategory();
          if(this.category_id_state == "invalid"){
            return
          }
          this.checkCity();
          if(this.city_state == "invalid"){
            return
          }
          this.checkAddress();
          if(this.address_state == "invalid"){
            return
          }
          this.checkLatitude();
          if(this.latitude_state == "invalid"){
            return
          }
          this.checkLongitude();
          if(this.longitude_state == "invalid"){
            return
          }
          this.checkShortDescription();
          if(this.short_description_state == "invalid"){
            return
          }
          this.new_venue.latitude = parseFloat(this.new_venue.latitude);
          this.new_venue.longitude = parseFloat(this.new_venue.longitude);
          this.updateNewVenue();
          this.start_loading = true;
          setTimeout( () => {
            this.backToMyVenue()
          }, 2000);
        },
        updateNewVenue: function () {
          this.$http.patch('http://127.0.0.1:4941/api/v1/venues/' + this.$route.params.venueId,
            JSON.stringify(this.new_venue),
            {headers: {'X-Authorization': this.$cookies.get('token')}})
            .then(function (response) {

            },function (error) {
              if(error.status == 400){
                alert("Bad Request: cannot update this venue");
              }
              if(error.status == 401){
                alert("Unauthorized: cannot update this venue");
              }
              if(error.status == 403){
                alert("Forbidden: cannot update this venue");
              }
              if(error.status == 404){
                alert("Not Found: cannot find this venue");
              }
            });
        }
      }
    }
</script>

<style scoped>

</style>
