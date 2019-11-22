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
      <b-row>
        <b-button id="add_venue"
                  pill
                  variant="dark"
                  class="mt-2 mb-1 ml-4"
                  style="float: left;"
                  @click="switchPage('/users/'+ $cookies.get('userId')+'/myVenue')"><</b-button>
        <b-tooltip target="add_venue" placement="right" title="Back to my venue"/>
      </b-row>
      <b-row>
        <b-form-file
          v-model="file"
          :state="file_state"
          placeholder="Upload new venue photo..."
          accept="image/jpeg, image/png"
          class="w-25 ml-5 mt-1 mb-1"
          style="float: left"
        ></b-form-file>
        <b-form-checkbox v-model="set_primary" switch class="ml-3 mt-3">
          <strong>
            Set Primary
          </strong>
        </b-form-checkbox>
        <b-button variant="dark" class="ml-4" size="sm" @click="uploadNewPic()">Upload</b-button>
      </b-row>
      <hr style="border: 1px solid lightgrey;" />
      <h5 class="ml-2" style="text-align: left"><strong>Your venue photo:</strong></h5>
      <b-card-group deck class="ml-md-2 mt-2" >
        <div v-for="photo in venue_photos">
          <div v-if="photo.isPrimary == true">
            <b-card img-alt="Image"
                    img-top
                    img-height="300"
                    style="max-width: 20rem;"
                    bg-variant="light"
                    class="mb-md-2"
                    :img-src="'http://127.0.0.1:4941/api/v1/venues/'
                              + $route.params.venueId + '/photos/' + photo.photoFilename">
              <b-button variant="danger" size="sm"
                        @click="delete_btn_push = !delete_btn_push; photo_name=photo.photoFilename">Delete</b-button>
            </b-card>

          </div>
          <div v-else>
            <b-card img-alt="Image"
                    img-top
                    img-height="300"
                    style="max-width: 20rem;"
                    bg-variant="light"
                    class="mb-md-2"
                    :img-src="'http://127.0.0.1:4941/api/v1/venues/'
                              + $route.params.venueId + '/photos/' + photo.photoFilename">
              <b-button variant="dark" size="sm"
                        @click="set_default_btn_push = !set_default_btn_push; photo_name=photo.photoFilename">Set primary</b-button>
              <b-button variant="danger" size="sm"
                        @click="delete_btn_push = !delete_btn_push; photo_name=photo.photoFilename">Delete</b-button>
            </b-card>
          </div>

        </div>
      </b-card-group>

      <b-modal v-model="delete_btn_push"
               :header-bg-variant="modalBackground"
               @ok="deleteVenuePhoto()">
        <h4>Are your sure you want to delete this photo?</h4>
      </b-modal>

      <b-modal v-model="set_default_btn_push"
               :header-bg-variant="modalBackground"
               @ok="setPhotoPrimary()">
        <h4>Are your sure you want to set this photo to primary?</h4>
      </b-modal>

    </div>
  </div>
</template>

<script>
    export default {
        name: "updateVenuePicture",
        data(){
          return{
            is_valid: false,

            set_default_btn_push: false,
            delete_btn_push:false,

            modalBackground: 'light',
            file_state:null,

            set_primary: false,
            file: null,
            venue_photos: [],
            is_default: true,
            img_src_string:"",
            user_username: "",
            photo_name: ""
          }
      },
      mounted: function () {
        this.checkValid();
        this.getUserPhoto();
        this.loadUserOwnName();
        this.loadVenuePhoto(this.$route.params.venueId);
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
        loadVenuePhoto: function (id) {
          this.$http.get('http://127.0.0.1:4941/api/v1/venues/'+id)
            .then(function (response) {
              this.venue_photos = response.data.photos;
            }, function (error) {
              alert(error.status);

            })
        },
        uploadNewPic: function () {
          if(this.file == null){
            alert("Please choose a png or jpeg photo");
            this.file_state = "invalid";
            return
          }
          if(this.file.type != 'image/png' &&
            this.file.type != 'image/jpg' &&
            this.file.type != 'image/jpeg'){
            alert("Please select a png or jpeg photo");
            this.file_state = "invalid";
            return
          }
          if(this.file.size > 1024 * 1024 * 20){
            alert("Photo cannot bigger than 20MB");
            this.file_state = "invalid";
            return
          }
          this.file_state = "valid";
          this.handlePhotoPost();
        },
        setPhotoPrimary: function(){
          this.$http.post('http://127.0.0.1:4941/api/v1/venues/'+ this.$route.params.venueId + '/photos/'+this.photo_name+'/setPrimary',
                          null,{headers: {'X-Authorization': this.$cookies.get('token')}})
            .then(function (response) {
              this.$cookies.set('venueId', this.$route.params.venueId);
              this.switchPage('/venuePhotoLoading');
            }, function (error) {
              if(error.status == 401){
                alert("Unauthorized: you cannot set this image to primary");
                return
              }
              if(error.status == 403){
                alert("Forbidden: you cannot set this image to primary");
                return
              }
              if(error.status == 404){
                alert("Not Found: cannot find this image");
                return
              }
            })
        },
        deleteVenuePhoto: function(){
          this.$http.delete('http://127.0.0.1:4941/api/v1/venues/'+ this.$route.params.venueId + '/photos/'+this.photo_name,
                          {headers: {'X-Authorization': this.$cookies.get('token')}})
            .then(function (response) {
              this.$cookies.set('venueId', this.$route.params.venueId);
              this.switchPage('/venuePhotoLoading');
            }, function (error) {
              if(error.status == 401){
                alert("Unauthorized: you cannot delete this image");
                return
              }
              if(error.status == 403){
                alert("Forbidden: you cannot delete this image");
                return
              }
              if(error.status == 404){
                alert("Not Found: cannot find this image");
                return
              }
            })
        },
        handlePhotoPost: function () {
          let data = new FormData();

          data.append('photo', this.file);
          data.append('description', 'A scenic view.');
          data.append('makePrimary', this.set_primary);
          this.$http.post('http://127.0.0.1:4941/api/v1/venues/'+ this.$route.params.venueId + '/photos',data,
                          {headers:{'X-Authorization': this.$cookies.get('token')}})
            .then(function (response) {
              this.$cookies.set('venueId', this.$route.params.venueId);
              this.switchPage('/venuePhotoLoading');
            }, function (error) {
              if(error.status == 400){
                alert("Bad Request: image must be png or jpeg");
                return
              }
              if(error.status == 401){
                alert("Unauthorized: you cannot post this image");
                return
              }
              if(error.status == 403){
                alert("Forbidden: you cannot post this image");
                return
              }
              if(error.status == 404){
                alert("Not Found: cannot find this venue");
                return
              }
            })
        }
      }
    }
</script>

<style scoped>

</style>
