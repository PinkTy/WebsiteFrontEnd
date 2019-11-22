<template>
  <div style="position: relative; top: -50px;">
    <b-alert
      variant="success"
      dismissible
      fade
      :show="successCountDown"
      @dismissed="successCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      Your profile already changed!
    </b-alert>

    <b-navbar toggleable="lg" type="dark" variant="dark">
      <img alt="venuePage" v-bind="{width: 35, height: 35}" style="float:left" class="ml-1 mr-2" :src="require('../assets/member.png')">
      <b-navbar-brand>Profile</b-navbar-brand>

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
          <b-dropdown-item v-on:click="logout_click()">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>


    <div v-if="load_404 == true">
      <b-img fluid :src="require('../assets/404.png')"></b-img>
    </div>
    <div v-else>
      <b-container fluid class="bg-light">
      <b-row>
        <b-col>
          <div v-if="is_default_user_photo">
            <b-img class="mt-1 ml-2"
                   v-bind="{width: 230, height: 230}"
                   :src="require('../assets/default.png')"></b-img>

            <input
              type="file"
              @change="photoSelected"
              ref="file_user1"
              accept="image/png, image/jpeg"
              style="display: none"
            />
            <b-row>
              <b-button variant="dark" class="ml-auto mr-auto mt-3 mb-2"
                        v-if="$route.params.userId == this.$cookies.get('userId')"
                        @click="$refs.file_user1.click()">Upload</b-button>
            </b-row>
          </div>
          <div v-else>
            <b-img fluid
                   class="mt-1 ml-2"
                   v-bind="{width: 230, height: 230}"
                   :src="user_photo_string"></b-img>
            <input
              type="file"
              ref="file_user2"
              @change="photoSelected"
              accept="image/png, image/jpeg"
              style="display: none"
            />
            <b-row>
            <b-button variant="dark" class="ml-auto mr-auto mt-3 mb-2"
                      v-if="$route.params.userId == this.$cookies.get('userId')"
                      @click="$refs.file_user2.click()">Upload</b-button>
            <b-button variant="danger" class="mr-auto mt-3 mb-2"
                      v-if="$route.params.userId == this.$cookies.get('userId')"
                      @click="delete_push=!delete_push">Delete</b-button>
            </b-row>
          </div>
        </b-col>
        <b-col cols="8">

          <b-card style="position:absolute;width: 20rem;top: 10%;"
                  class="ml-5 mt-3"
                  bg-variant="light">

            <b-row>
              <img alt="venuePage"
                   v-bind="{width: 25, height: 25}"
                   style="float:left"
                   class="ml-1 mr-2"
                   :src="require('../assets/profile.png')">
              <h5><strong>Profile Information</strong></h5>
            </b-row>
            <hr style="border: 0.5px solid gray;" />
            <b-card-text style="text-align: left"><strong>Username: </strong>{{this.user_details.username}}</b-card-text>
            <b-card-text style="text-align: left"><strong>Given name: </strong>{{this.user_details.givenName}}</b-card-text>
            <b-card-text style="text-align: left"><strong>Family name: </strong>{{this.user_details.familyName}}</b-card-text>
            <b-card-text style="text-align: left"
                           v-if="user_details.emailAddress!=undefined">
              <strong>Email: </strong>{{this.user_details.emailAddress}}
            </b-card-text>
            <b-button variant="dark"
                        v-if="$route.params.userId == this.$cookies.get('userId')"
                        size="sm"
                        @click="edit_user_push = !edit_user_push">
                  Edit Information
            </b-button>
            <b-button variant="dark"
                      v-if="$route.params.userId == this.$cookies.get('userId')"
                      size="sm"
                      @click="password_change_push = !password_change_push">
              Change Password
            </b-button>
          </b-card>
        </b-col>
      </b-row>
      </b-container>

      <b-modal v-model="delete_push"
               :header-bg-variant="modalBackground"
               title="Delete:"
               @show="resetModel"
               @ok="handleDelete">
        <h3>Are you sure you want to delete your photo?</h3>
      </b-modal>

      <b-modal v-model="password_change_push"
               ref="edit_password_modal"
               :header-bg-variant="modalBackground"
               title="Edit user information:"
               @show="resetPasswordModal"
               @hidden="resetPasswordModal"
               @ok="handlePasswordChange">
        <b-form-group
          label="Current password:"
          label-for="current-password-content-input"
          :invalid-feedback="current_password_alert"
        >
        <b-form-input
          id="current-password-content-input"
          v-model="current_password"
          required
          placeholder="Current password"
          :state="current_password_content_state"
          :type="passwordField"
        ></b-form-input>
        </b-form-group>

        <b-form-group
          label="New password:"
          label-for="new-password-content-input"
          :invalid-feedback="new_password_alert"
        >
        <b-form-input
          id="new-password-content-input"
          v-model="password"
          required
          placeholder="New password"
          :state="new_password_content_state"
          :type="passwordField"
        ></b-form-input>
        </b-form-group>
      </b-modal>

      <b-modal v-model="edit_user_push"
               ref="edit_user_modal"
               :header-bg-variant="modalBackground"
               title="Edit user information:"
               @show="resetEditUserModal"
               @hidden="resetEditUserModal"
               @ok="handleUserChange">
        <b-form @submit.stop.prevent="changeUser">
          <b-form-group
            label="Given name:"
            label-for="givenName-content-input"
            :invalid-feedback="given_name_alert"
          >
            <b-form-input
              id="givenName-content-input"
              v-model="edit_user.givenName"
              required
              :state="given_name_content_state"
              :value="edit_user.givenName"
            ></b-form-input>
          </b-form-group>
          <b-form-group
              label="Family name:"
              label-for="familyNam-content-input"
              :invalid-feedback="family_name_alert"
          >
            <b-form-input
                id="familyNam-content-input"
                v-model="edit_user.familyName"
                required
                :state="family_name_content_state"
                :vaule="edit_user.familyName"
              ></b-form-input>
          </b-form-group>

        </b-form>
      </b-modal>
    </div>


  </div>
</template>

<script>
    export default {
      name: "user",
      data() {
        return {
          user_photo: null,
          errors: "",
          load_404: false,
          delete_push: false,
          edit_user_push:false,
          password_change_push: false,

          modalBackground: 'light',
          passwordField:'password',

          file_name: "",

          all_user_list: [],
          user_username: "",
          user_details: {
            username: '',
            givenName: '',
            familyName: '',
            emailAddress: ''
          },
          edit_user:{
            givenName: "",
            familyName: "",
          },
          current_password:"",
          password: "",

          given_name_alert:"",
          family_name_alert:"",
          current_password_alert:"",
          new_password_alert:"",

          given_name_content_state:null,
          family_name_content_state:null,
          current_password_content_state:null,
          new_password_content_state:null,

          is_default: true,
          is_default_user_photo: true,
          current_password_not_match:true,
          img_src_string: "",
          user_photo_string: "",

          successCountDown: 0,
          dismissSecs:1,

        }
      },
      mounted: function(){
        this.loadUserName();
        this.loadOwnInformation();
        this.getUserPhoto();
        this.loadPhoto();
      },
      methods: {
        /**
         * check the photo is png or jpeg type and cannot bigger than 20MB.
         * @param e
         */
          photoSelected(e) {
            this.user_photo = e.target.files[0];
            if(this.user_photo.type != 'image/png' &&
                this.user_photo.type != 'image/jpg' &&
                this.user_photo.type != 'image/jpeg'){
              e.preventDefault();
              alert('Please choose png or jpeg type photo!');
              return;
            }
            if(this.user_photo.size > 1024 * 1024 * 20){
              e.preventDefault();
              alert('Photo size cannot bigger than 20MB!');
              return
            }
            if(this.user_photo.type == 'image/png'){
              this.handlePng();
              return
            }
            if(this.user_photo.type == 'image/jpg' || this.user_photo.type == 'image/jpeg'){
              this.handleJpeg();
              return
            }
          },
          handlePng: function(){
            this.$http.put('http://127.0.0.1:4941/api/v1/users/'+ this.$cookies.get('userId') + '/photo',this.user_photo,
                            {headers: {'X-Authorization': this.$cookies.get('token'), 'Content-Type':'image/png'}})
              .then(function (response) {
                this.switchPage('/profileLoading')
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
                  alert("Not Found: cannot find this user");
                  return
                }
              })
          },
          handleJpeg: function(){
            this.$http.put('http://127.0.0.1:4941/api/v1/users/'+ this.$cookies.get('userId') + '/photo',this.user_photo,
              {headers: {'X-Authorization': this.$cookies.get('token'), 'Content-Type':'image/jpeg'}})
              .then(function (response) {
                this.switchPage('/profileLoading')
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
                  alert("Not Found: cannot find this user");
                  return
                }
              })
          },
          countDownChanged(successCountDown) {
            this.successCountDown = successCountDown;
          },
          showAlert() {
            this.successCountDown = this.dismissSecs
          },
          logout_click: function () {
            this.logout();
          },
          loadUserName: function(){
            this.$http.get('http://127.0.0.1:4941/api/v1/users/'+ this.$cookies.get('userId'))
              .then(function(response){
                this.user_username = response.data.username;
              }, function (error) {
                this.error = error;
              })
          },
          loadOwnInformation: function () {
            this.$http.get('http://127.0.0.1:4941/api/v1/users/'+ this.$route.params.userId, {headers: {'X-Authorization': this.$cookies.get('token')}})
              .then(function(response){
                this.user_details.username = response.data.username;
                this.user_details.givenName = response.data.givenName;
                this.edit_user.givenName = response.data.givenName;
                this.user_details.familyName = response.data.familyName;
                this.edit_user.familyName = response.data.familyName;
                this.user_details.emailAddress = response.data.email;
                this.load_404 = false;
              }, function (error) {
                this.error = error;
                if(this.error.status == 404){
                  this.load_404 = true;
                }
              })
          },
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
        loadPhoto: function() {
          this.$http.get('http://127.0.0.1:4941/api/v1/users/'+ this.$route.params.userId +'/photo')
            .then(function (response) {
              this.user_photo_string = 'http://127.0.0.1:4941/api/v1/users/'+ this.$route.params.userId +'/photo';
              this.is_default_user_photo = false;
            },function (error) {
              if(error.status==404){
                this.is_default_user_photo = true;
              }
            })
        },
        currentPasswordCheckFromServer: function(){
            this.$http.post('http://127.0.0.1:4941/api/v1/users/login',
            JSON.stringify({username: this.user_username,
                            email: "",
                            password:this.current_password}))
            .then(function (response) {

              this.current_password_not_match = false;
              this.$cookies.set("is_login", 'true');
              this.$cookies.set("userId", response.data.userId);
              this.$cookies.set("token", response.data.token);
            }, function (error) {
              this.current_password_not_match = true;
            })
        },
        checkGivenName: function(){
          if(this.edit_user.givenName.length == 0){
            this.given_name_alert = "Cannot be empty";
            this.given_name_content_state="invalid";
          } else {
            this.given_name_content_state = "valid";
          }
        },
        checkFamilyName: function(){
          if(this.edit_user.familyName.length == 0){
            this.family_name_alert = "Cannot be empty";
            this.family_name_content_state="invalid";
          } else {
            this.family_name_content_state = "valid";
          }
        },
        checkCurrentPassword: function(){
          if(this.current_password.length == 0){
            this.current_password_alert = "Please provide current password";
            this.current_password_content_state = "invalid";
            return
          }
        },
        checkNewPassword: function(){
          if(/\s/.test(this.password)){
            this.new_password_alert = "Password cannot contain space!";
            this.new_password_content_state = "invalid";
            return
          }
          if(this.password.length == 0){
            this.new_password_alert = "Password cannot be empty";
            this.new_password_content_state = "invalid";
            return
          }
          this.new_password_content_state = "valid";
        },
        resetModel: function () {
          this.delete_push = false;
        },
        resetPasswordModal: function(){
          this.current_password_content_state = null;
          this.new_password_content_state = null;
          this.current_password_not_match = true;

          this.current_password = "";
          this.password = "";
        },
        resetEditUserModal:function(){
          this.given_name_content_state = null;
          this.family_name_content_state = null;
        },
        handleUserChange: function (bvModalEvt) {
          bvModalEvt.preventDefault();
          this.changeUser();
        },
        handlePasswordChange: function(bvModalEvt){
          bvModalEvt.preventDefault();
          this.changePassword();
        },
        changePassword: function(){
          this.checkCurrentPassword();
          this.currentPasswordCheckFromServer();
          setTimeout(() =>{
            if(this.current_password_not_match == true){
              this.current_password_alert = "Current password is wrong";
              this.current_password_content_state = "invalid";
              return
            } else {
              this.current_password_content_state = "valid";
              this.checkNewPassword();
              if(this.new_password_content_state == "invalid"){
                return
              }
              this.postPasswordChange();
              this.$nextTick(() => {
                this.$refs.edit_password_modal.hide()
              })
            }

          },500);
        },
        postPasswordChange: function(){
          this.$http.patch('http://127.0.0.1:4941/api/v1/users/'+ this.$cookies.get('userId')
                            ,JSON.stringify({'password': this.password}),
                              {headers: {'X-Authorization': this.$cookies.get('token')}})
            .then(function (response) {
              this.showAlert();
              setTimeout(()=>{
                this.switchPage('/profileLoading')
              },1000);


            }, function (error) {
              if(error.status == 400){
                alert("400 Bad Request")
              }
              if(error.status == 401){
                alert("401 Unauthorized")
              }
              if(error.status == 403){
                alert("403 Forbidden")
              }
              if(error.status == 404){
                alert("404 Not Found")
              }
            })
        },
        changeUser: function(){
          this.checkGivenName();
          if(this.given_name_content_state == "invalid"){
            return
          }
          this.checkFamilyName();
          if(this.family_name_content_state == "invalid"){
            return
          }
          this.postUserChange();
          this.$nextTick(() => {
            this.$refs.edit_user_modal.hide()
          });

        },
        postUserChange: function(){
          this.$http.patch('http://127.0.0.1:4941/api/v1/users/'+ this.$cookies.get('userId'),JSON.stringify(this.edit_user),
            {headers: {'X-Authorization': this.$cookies.get('token')}})
            .then(function (response) {
              this.showAlert();
              setTimeout(()=>{
                this.switchPage('/profileLoading')
              },1000);


            }, function (error) {
              if(error.status == 400){
                alert("400 Bad Request")
              }
              if(error.status == 401){
                alert("401 Unauthorized")
              }
              if(error.status == 403){
                alert("403 Forbidden")
              }
              if(error.status == 404){
                alert("404 Not Found")
              }
            })
        },
        handleDelete: function () {
          this.$http.delete('http://127.0.0.1:4941/api/v1/users/'+ this.$cookies.get('userId') +'/photo',
            {headers: {'X-Authorization': this.$cookies.get('token')}})
            .then(function (response) {
              this.is_default = true;
              this.is_default_user_photo = true;
            },function (error) {
              if(error.status==404){
                alert("Cannot delete that photo right now 404")
              }
              if(error.status == 403){
                alert("Cannot delete that photo right now 403")
              }
              if(error.status == 401){
                alert("Cannot delete that photo right now 401")
              }
            })
        }
      }
    }
</script>

<style scoped>
</style>
