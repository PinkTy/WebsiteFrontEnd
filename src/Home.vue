<template>
    <div style="position: relative; top: -50px;">
      <b-alert
        variant="danger"
        dismissible
        fade
        :show="login_warning"
        @dismissed="login_warning = false"
      >
       User does not exist or wrong password!
      </b-alert>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand style="text-align:left;" class="ml-1">
          <img alt="homepage" style="width: 5%;float:left" class="ml-1 mr-2" :src="require('./assets/homepage.png')">
          Homepage
        </b-navbar-brand>

        <b-navbar-nav class="ml-auto">
          <b-nav tabs>
            <b-nav-item right
                        @click="login_warning = false;switchPage('/venues')">
              Find Venue
            </b-nav-item>
          </b-nav>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav tabs>
            <b-nav-item right
                        @click="login_warning = false;switchPage('/help')">
              Help
            </b-nav-item>
          </b-nav>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav tabs>
            <b-nav-item v-if="this.$cookies.get('is_login') == 'false' || this.$cookies.isKey('is_login') == false"
                        @click="login_warning = false;login_push = !login_push">
              Login
            </b-nav-item>
          </b-nav>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav tabs>
            <b-nav-item v-if="this.$cookies.get('is_login') == 'false' || this.$cookies.isKey('is_login') == false"
                        @click="login_warning = false;register_push = !register_push">
              Register
            </b-nav-item>
          </b-nav>
        </b-navbar-nav>
        <b-img alt="user"
               v-bind="{width: 35, height: 35}"
               rounded="circle"
               v-if="is_default==true && $cookies.get('is_login') == 'true'"
               :src="require('./assets/default.png')"/>
        <b-img alt="user"
               v-bind="{width: 35, height: 35}"
               rounded="circle"
               v-if="is_default==false && $cookies.get('is_login') == 'true'"
               :src="img_src_string"/>
        <b-navbar-nav v-if="$cookies.get('is_login') == 'true'">
          <b-nav-item-dropdown right :text="user_username">
            <b-dropdown-item @click="switchPage('/users/' + $cookies.get('userId'))">Profile</b-dropdown-item>
            <b-dropdown-item @click="switchPage('/users/' + $cookies.get('userId') + '/myVenue')">My Venue</b-dropdown-item>
            <b-dropdown-item @click="logout()">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-navbar>


      <b-modal v-model="register_push"
               ref="register_modal"
               :header-bg-variant="modalBackground"
               title="Register:"
               @show="resetRegisterModal"
               @hidden="resetRegisterModal"
               @ok="handleRegister">
        <b-form @submit.stop.prevent="register">
          <b-form-group
            label="Username:"
            label-for="username-content-input"
            :invalid-feedback="username_alert"
          >
            <b-form-input
              id="username-content-input"
              v-model="register_value.username"
              required
              placeholder="Username"
              :state="username_content_state"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="Email:"
            label-for="email-content-input"
            :invalid-feedback="email_alert"
          >
            <b-form-input
              id="email-content-input"
              v-model="register_value.email"
              required
              placeholder="Email"
              :state="email_content_state"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="Password:"
            label-for="password-content-input"
            :invalid-feedback="password_alert"
          >
            <b-form-input
              id="password-content-input"
              v-model="register_value.password"
              required
              placeholder="Password"
              :state="register_password_content_state"
              :type="passwordField"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="Confirm password:"
            label-for="confirm-password-content-input"
            :invalid-feedback="confirm_password_alert"
          >
            <b-form-input
              id="confirm-password-content-input"
              v-model="confirm_password"
              required
              placeholder="Confirm password"
              :state="confirm_password_content_state"
              :type="passwordField"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="Family name:"
            label-for="family-name-content-input"
            :invalid-feedback="family_name_alert"
          >
            <b-form-input
              id="family-name-content-input"
              v-model="register_value.familyName"
              required
              placeholder="Family name"
              :state="family_name_content_state"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="Given name:"
            label-for="Given-name-content-input"
            :invalid-feedback="given_name_alert"
          >
            <b-form-input
              id="Given-name-content-input"
              v-model="register_value.givenName"
              required
              placeholder="Given name"
              :state="given_name_content_state"
            ></b-form-input>
          </b-form-group>
        </b-form>
      </b-modal>

      <b-modal v-model="login_push"
               ref="login_modal"
               :header-bg-variant="modalBackground"
               title="Login:"
               @show="resetModal"
               @hidden="resetModal"
               @ok="handleOk">
          <b-form @submit.stop.prevent="login">
            <b-form-group
              label="Enter username or Email:"
              label-for="login-content-input"
              invalid-feedback="Can't be empty"
            >
              <b-form-input
                id="login-content-input"
                v-model="login_value.logIn"
                required
                placeholder="Email or username"
                :state="login_content_state"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              label="Enter your password:"
              label-for="password-input"
              invalid-feedback="Can't be empty"
            >
              <b-form-input
                id="password-input"
                v-model="login_value.password"
                required
                placeholder="Password"
                :state="password_content_state"
                :type="passwordField"
              ></b-form-input>
            </b-form-group>
        </b-form>
      </b-modal>
      <b-container>
        <b-row>
          <b-col style="position: absolute; top: 400%">
            <b-row>
              <h2>
                <strong>
                Discover venues that
                </strong>
              </h2>
            </b-row>
            <b-row>
              <h2>
                <strong>
                  near you
                </strong>
              </h2>
            </b-row>
            <b-row>
              <b-button
                varaint="dark"
                class="mt-2"
                size="lg"
                @click="switchPage('/venues')">Find Venue</b-button>
            </b-row>
          </b-col>
          <b-col>
            <b-img
              v-bind="{width: 380, height: 400}"
              style="position: absolute; right: 10%;"
              class="mt-xl-5"
              :src="require('./assets/test.gif')"></b-img>
          </b-col>
        </b-row>
      </b-container>
    </div>

</template>

<script>
    export default {
        data(){
          return{
            is_default: true,
            img_src_string:"",

            error: "",
            user_username: "",

            login_push:false,
            register_push:false,

            modalBackground: 'light',
            passwordField:'password',

            login_content_state:null,
            password_content_state:null,
            login_value:{
              logIn: "",
              password:""
            },
            login_jason:{
              "username": "",
              "email": "",
              "password": ""
            },
            login_warning: false,


            username_alert:"",
            email_alert:"",
            password_alert:"",
            confirm_password_alert:"",
            family_name_alert:"",
            given_name_alert:"",

            username_or_email_invalid: false,

            username_content_state:null,
            email_content_state:null,
            register_password_content_state:null,
            confirm_password_content_state:null,
            family_name_content_state:null,
            given_name_content_state:null,

            register_value: {
              username: "",
              email: "",
              givenName: "",
              familyName: "",
              password: ""
            },
            confirm_password: ""
          }
        },
        mounted: function(){
          this.loadUserOwnName();
          this.getUserPhoto();
        },
        methods: {
          /**
           * get user photo from server, if not use the default photo
           */
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
          /**
           * get the username from server
           */
          loadUserOwnName: function(){
            this.$http.get('http://127.0.0.1:4941/api/v1/users/'+ this.$cookies.get('userId'))
              .then(function(response){
                this.user_username = response.data.username;
              }, function (error) {
                this.error = error;
              })
          },
          /**
           * login username or email cannot be empty
           */
          checkLoginEmpty: function(){
            if(this.login_value.logIn.length == 0){
              this.login_content_state = "invalid"
            } else {
              this.login_content_state = "valid"
            }
          },
          /**
           * login password cannot be empty
           */
          checkPasswordEmpty: function(){
            if(this.login_value.password.length == 0){
              this.password_content_state = "invalid"
            } else {
              this.password_content_state = "valid"
            }
          },
          /**
           * check the email for login or register is valid
           * @param email
           * @returns {boolean}
           */
          checkEmail: function(email){
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
          },
          /**
           * reset the login modal, after user close login window
           */
          resetModal: function() {
            this.login_value.logIn = "";
            this.login_value.password = "";
            this.login_content_state = null;
            this.password_content_state = null;
          },
          /**
           * handle the login information to the sever
           * @param bvModalEvt
           */
          handleOk: function(bvModalEvt) {
            bvModalEvt.preventDefault();
            this.login()
          },
          /**
           * check all the login information is valid, if is not,
           * user cannot login
           */
          login: function(){
            this.checkLoginEmpty();
            if(this.login_content_state == "invalid"){
              return
            }
            this.checkPasswordEmpty();
            if(this.password_content_state == "invalid"){
                return
            }
            if(this.checkEmail(this.login_value.logIn)){
              this.login_jason.email = this.login_value.logIn;
            } else {
              this.login_jason.username = this.login_value.logIn;
            }
            this.login_jason.password = this.login_value.password;
            this.postLogin();
            this.$nextTick(() => {
              this.$refs.login_modal.hide()
            })
          },
          /**
           * login to the server, and save the user id and token to the cookies
           */
          postLogin: function () {
            this.$http.post('http://127.0.0.1:4941/api/v1/users/login', JSON.stringify(this.login_jason))
              .then(function (response) {
                this.login_warning = false;
                this.$cookies.set("is_login", 'true');
                this.$cookies.set("userId", response.data.userId);
                this.$cookies.set("token", response.data.token);
                this.switchPage('/loading')
              }, function (error) {
                this.error = error;
                if(this.error.status == 400){
                  this.login_warning = true;
                  this.login_jason.username = "";
                  this.login_jason.email = "";
                  this.login_jason.password = "";
                }
              })
          },
          /**
           * add new user to the server
           */
          postRegister: function(){
            this.$http.post('http://127.0.0.1:4941/api/v1/users', JSON.stringify(this.register_value))
              .then(function (response) {
                this.username_or_email_invalid = false;
                return
              }, function (error) {
                this.error = error;
                if(this.error.status == 400){
                  this.username_or_email_invalid = true;
                }
              })
          },
          /**
           * username for register cannot be empty and have spaces.
           */
          checkUsernameRegister:function(){
            if(/\s/.test(this.register_value.username)){
              this.username_content_state = "invalid";
              this.username_alert = "Cannot contain space in the username";
              return
            }
            if(this.register_value.username.length == 0 || this.register_value.username.length > 64){
                this.username_content_state = "invalid";
                this.username_alert = "Username must between 1 and 64 characters!"
                return
            }
            this.username_content_state = "valid";
          },
          /**
           * email for register should be in right format
           */
          checkEmailRegister: function(){
            if(!this.checkEmail(this.register_value.email)){
              this.email_alert = "Please check your email format";
              this.email_content_state = "invalid";
              return
            }
            this.email_content_state = "valid";
          },
          /**
           * check register password cannot be empty and contain space
           */
          checkRegisterPassword: function(){
            if(/\s/.test(this.register_value.password)){
              this.password_alert = "Password cannot contain space!";
              this.register_password_content_state = "invalid";
              return
            }
            if(this.register_value.password.length == 0){
              this.password_alert = "Password cannot be empty";
              this.register_password_content_state = "invalid";
              return
            }
            this.register_password_content_state = "valid";
          },
          /**
           * check confirm password match the password
           */
          checkConfirmPassword: function(){
            if(this.confirm_password.length == 0){
              this.confirm_password_alert = "Cannot be empty";
              this.confirm_password_content_state = "invalid";
              return
            }
            if(this.confirm_password != this.register_value.password){
              this.confirm_password_alert = "Password does not match";
              this.confirm_password_content_state = "invalid";
              return
            }
            this.confirm_password_content_state = "valid";

          },
          /**
           * family name for register cannot be empty
           */
          checkFamilyName: function(){
            if(this.register_value.familyName.length == 0){
              this.family_name_alert = "Cannot be empty";
              this.family_name_content_state="invalid";
            } else {
              this.family_name_content_state = "valid";
            }
          },
          /**
           * given name for register cannot be empty
           */
          checkGivenName: function(){
            if(this.register_value.givenName.length == 0){
              this.given_name_alert = "Cannot be empty";
              this.given_name_content_state="invalid";
            } else {
              this.given_name_content_state = "valid";
            }
          },
          /**
           * reset the register modal, if user close register modal
           */
          resetRegisterModal: function () {
            this.username_alert = "";
            this.email_alert = "";
            this.password_alert = "";
            this.confirm_password_alert = "";
            this.family_name_alert = "";
            this.given_name_alert="";
            this.username_or_email_invalid=false;
            this.register_value.username = "";
            this.register_value.email="";
            this.register_value.familyName="";
            this.register_value.givenName="";
            this.register_value.password="";
            this.confirm_password = "";

            this.username_content_state = null;
            this.email_content_state = null;
            this.register_password_content_state = null;
            this.confirm_password_content_state = null;
            this.family_name_content_state = null;
            this.given_name_content_state = null;
          },
          /**
           * handle register information to the server
           * @param bvModalEvt
           */
          handleRegister: function (bvModalEvt) {
            bvModalEvt.preventDefault();
            this.register()
          },
          /**
           * check all the register information is correct
           */
          register: function () {
            this.checkUsernameRegister();
            if(this.username_content_state == "invalid"){
              return
            }
            this.checkEmailRegister();
            if(this.email_content_state == "invalid"){
              return
            }
            this.checkRegisterPassword();
            if(this.register_password_content_state == "invalid"){
              return
            }
            this.checkConfirmPassword();
            if(this.confirm_password_content_state == "invalid"){
              return
            }
            this.checkFamilyName();
            if(this.family_name_content_state=="invalid"){
              return
            }
            this.checkGivenName();
            if(this.given_name_content_state == "invalid"){
              return
            }
            this.postRegister();
            //check username and email cannot be duplicated
            setTimeout(()=>{
              if(this.username_or_email_invalid == true){
                this.username_content_state = "invalid";
                this.email_content_state = "invalid";
                this.username_alert = "username or email already exist!"
                this.email_alert = "username or email already exist!"
                return
              } else {
                this.login_jason.username = this.register_value.username;
                this.login_jason.email = this.register_value.email;
                this.login_jason.password = this.register_value.password;

                setTimeout( () => {
                  this.postLogin()
                }, 500);
                this.$nextTick(() => {
                  this.$refs.register_modal.hide()
                })
              }
            },500);
          }
        }
    }
</script>

<style scoped>

</style>
