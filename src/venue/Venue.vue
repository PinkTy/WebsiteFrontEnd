<template>
    <div style="position: relative; top: -50px;">
      <div v-if="errorFlag" style="color: red">
        {{ error }}}
      </div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <img alt="venuePage" v-bind="{width: 35, height: 35}" style="float:left" class="ml-1 mr-2" :src="require('../assets/venue.png')">
        <b-navbar-brand>Venues</b-navbar-brand>

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
        <b-navbar-nav v-if="$cookies.get('is_login') == 'true'">
          <b-nav-item-dropdown right :text="user_username">
            <b-dropdown-item @click="switchPage('/users/' + $cookies.get('userId'))">Profile</b-dropdown-item>
            <b-dropdown-item @click="switchPage('/users/' + $cookies.get('userId') + '/myVenue')">My Venue</b-dropdown-item>
            <b-dropdown-item @click="logout()">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-navbar>

      <div v-if="$route.params.venueId">
        <div id="venue">
          <div v-if="single_venue.photos.length==0">
            <b-carousel
              fade
              indicators
              variant="info"
              background="lightgray"
              class="mb-2"
            >
              <b-carousel-slide
                class="mt-1"
                style="height:290px;width: 500px; left: 34%;"
                :img-src="require('../assets/default.png')"
              />
            </b-carousel>
          </div>
          <div v-else>
            <b-carousel
            no-animation
            indicators
            background="lightgray"
            class="mb-2"
            >
              <b-carousel-slide
                style=" height:290px;width: 500px; left: 34%;"
                v-for="(photo,index) in single_venue.photos"
                class="mt-1"
                :key="index"
                :img-src="getImageUrl($route.params.venueId, photo.photoFilename)"
              />
            </b-carousel>
          </div>

          <h2 style="text-align: left" class="ml-3 mt-1">
            <strong>{{single_venue.venueName}}</strong>
          </h2>

          <b-card-sub-title style="text-align: left" class="ml-3 mb-1">
            {{single_venue.city}} |
            <b-badge class="ml-2" variant="dark">{{single_venue.category.categoryName}}</b-badge>
          </b-card-sub-title>

          <b-row>
            <b-col cols="4" style="text-align: left">
              <b-link class="ml-3" style="color: royalblue;"
                      @click="switchPage('/users/' + single_venue.admin.userId)">
                Administrator: {{single_venue.admin.username}}
              </b-link>
            </b-col>
          </b-row>

          <b-row class="ml-3 mt-3">
            <b-img v-bind="{width: 35, height: 35}"
                   :src="require('../assets/address.png')"></b-img>
            <h4 style="text-align: left" class="mt-1 ml-2">
              Address: {{single_venue.address}}
            </h4>
          </b-row>

          <b-row class="ml-3 mt-2">
            <b-img v-bind="{width: 35, height: 35}"
                   :src="require('../assets/star.png')"></b-img>
            <h4 style="text-align: left" class="mt-1 ml-2">
              Date added: {{single_venue.dateAdded}}
            </h4>
          </b-row>

          <b-row class="ml-3 mt-2">
            <b-img v-bind="{width: 35, height: 35}"
                   :src="require('../assets/star.png')"></b-img>
            <h4 style="text-align: left" class="mt-1 ml-2">
              Star rating: {{getStarRating($route.params.venueId)}}
            </h4>
          </b-row>

          <b-row class="ml-3 mt-2">
            <b-img v-bind="{width: 35, height: 35}"
                   :src="require('../assets/star.png')"></b-img>
            <h4 style="text-align: left" class="mt-1 ml-2">
              Cost rating: {{getCostRating($route.params.venueId)}}
            </h4>
          </b-row>

          <b-card style="max-width: 70rem" class="ml-3 mt-2 mb-3">
            <b-card-title style="text-align: left" class="mb-1">
              <strong>
                Description:
              </strong>
            </b-card-title>
            <h6 class="card-text" style="text-align: left">{{single_venue.shortDescription}}</h6>
            <b-row>
              <b-col cols="4" style="text-align: left" class="mt-1 mb-1 ml-2">
                <b-button v-b-toggle.long-description class="mt-1 mb-1">Detail</b-button>
                <b-collapse id="long-description" class="mt-1 mb-1">
                   <b-card>{{ single_venue.longDescription}}</b-card>
                </b-collapse>
              </b-col>
            </b-row>
          </b-card>
          <hr style="border: 1px solid lightgrey;" />
          <h6 class="mb-3 ml-4" style="text-align: left">What guests love about this venue:</h6>
          <div v-if="reviews.length > 0">
            <b-card-group deck class="ml-md-3 mb-md-2">
              <div v-for="review in reviews">
                <b-card class="mb-2" style="width: 25rem;" >
                  <b-link slot="header" style="color: black;float: left"
                          @click="switchPage('/users/' + review.reviewAuthor.userId)">
                    <b-img v-bind="{width: 20, height: 20}"
                           :src="require('../assets/userReview.png')"></b-img>
                    <strong>
                      {{review.reviewAuthor.username}}
                    </strong>
                  </b-link>
                  <h6 class="md-2 mt-1" style="text-align: left"><strong>Star rating: </strong>{{review.starRating}}</h6>
                  <h6 class="md-2 mt-1" style="text-align: left"><strong>Cost rating: </strong>{{review.costRating}}</h6>
                  <h6 class="mt-1" style="text-align: left"><strong>Review: </strong>{{review.reviewBody}}</h6>
                  <div slot="footer" class="md-1" style="text-align: left"><small class="text-muted">{{review.timePosted}}</small></div>
                </b-card>
              </div>
            </b-card-group>
          </div>

          <b-button>
            <router-link style="color: white"
                         :to="{name: 'venue_homepage'}">Back</router-link>
          </b-button>
        </div>
      </div>

      <div v-else>
        <div id="venue_homepage">
          <b-button v-b-toggle.collapse-search pill size="sm" class="mt-2" style="position:absolute;right: 2%">+</b-button>
          <b-collapse visible id="collapse-search">
          <b-form @submit="search" size="md">
            <b-form inline>
              <label class="ml-4 mr-sm-1" for="city_select"><strong>City:</strong></label>
              <b-form-select id="city_select"
                             v-model="city_selected"
                             size="md"
                             class="mt-2 mr-xl-5 mb-md-2"
                             :options="cities">
              </b-form-select>

              <label class="ml-2 mr-sm-1" for="category_select"><strong>Category:</strong></label>
              <b-form-select id="category_select"
                             v-model="category_selected"
                             class="mt-2 mr-xl-5 mb-md-2"
                             :options="categories">
              </b-form-select>
              <label class="ml-2 mr-sm-1" for="rating_select"><strong>Sort by:</strong></label>
              <b-form-select id="rating_select"
                             v-model="rating_selected"
                             class="mt-2 mr-xl-5 mb-md-2">
                <option value="a" disabled>Please select one type</option>
                <optgroup label="Star rating">
                  <option value="null">Descending star rating</option>
                  <option value="b">Ascending star rating</option>
                </optgroup>
                <optgroup label="Cost rating">
                  <option value="c">Ascending cost rating</option>
                  <option value="d">Descending cost rating</option>
                </optgroup>
                <optgroup label="Distance" v-if="distance_visible">
                  <option value="e">Closet to further away</option>
                  <option value="f">further away to closet</option>
                </optgroup>
              </b-form-select>
            </b-form>

            <b-form inline>
              <label class="ml-4 mr-sm-1" for="star_rating_select"><strong>Star rating:</strong></label>
              <b-form-select id="star_rating_select"
                             v-model="star_rating_selected"
                             class="ml-2 mt-2 mr-xl-5 mb-md-2">
                <option value=null>All star rating</option>
                <option value=1>★</option>
                <option value=2>★★</option>
                <option value=3>★★★</option>
                <option value=4>★★★★</option>
                <option value=5>★★★★★</option>
              </b-form-select>
              <label class="ml-2 mr-sm-1" for="cost_rating_select"><strong>Cost rating:</strong></label>
              <b-form-select id="cost_rating_select"
                             v-model="cost_rating_selected"
                             class="mt-2 mr-xl-5 mb-md-2">
                <option value=null>All cost rating</option>
                <option value=0>Free</option>
                <option value=1>$</option>
                <option value=2>$$</option>
                <option value=3>$$$</option>
                <option value=4>$$$$</option>
              </b-form-select>
            </b-form>
            <b-form-input size="md"
                          class="ml-4 mr-sm-2 mt-2"
                          v-model="venue_key_name"
                          placeholder="Search venue name"
                          style="width:500px;">
            </b-form-input>
            <b-button size="md" class="mt-2" type="submit" variant="dark">Search</b-button>
          </b-form>
          </b-collapse>
          <hr style="border: 1px solid gray;" />

          <b-card-group deck class="ml-5" >
            <div v-for="venue in venues.slice(start_page,current_page)">
              <div v-if="venue.primaryPhoto == null">
                <b-card  img-alt="Image"
                         img-top
                         img-height="300"
                         style="width: 20rem;"
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
                  <b-button v-on:click="loadSingleVenue(venue.venueId);loadReviews(venue.venueId)">
                    <router-link style="color: white"
                                 :to="{name: 'venue', params: {venueId:venue.venueId}}">
                      See Detail
                    </router-link>
                  </b-button>

                  <b-button v-if="$cookies.get('is_login') == 'true'"
                            @click="review_push=!review_push; review_venue_id = venue.venueId">
                    Review
                  </b-button>
                </b-card>
              </div>
              <div v-else>
                <b-card img-alt="Image"
                        img-top
                        img-height="300"
                        style="width: 20rem;"
                        bg-variant="light"
                        class="mb-md-2"
                        :img-src="getImageUrl(venue.venueId, venue.primaryPhoto)">
                  <b-card-title class="text-left"><strong>{{venue.venueName}}</strong></b-card-title>
                  <b-card-sub-title class="text-left">{{venue.city}} |<b-badge class="ml-2" variant="dark">
                    {{getCategoryById(venue.categoryId)}}
                  </b-badge></b-card-sub-title>
                  <b-card-text class="text-left">
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
                  <b-button v-on:click="loadSingleVenue(venue.venueId);loadReviews(venue.venueId)">
                    <router-link style="color: white"
                                 :to="{name: 'venue', params: {venueId:venue.venueId}}">
                      See Detail
                    </router-link>
                  </b-button>
                  <b-button v-if="$cookies.get('is_login') == 'true'"
                            @click="review_push=!review_push; review_venue_id = venue.venueId">
                    Review
                  </b-button>
                </b-card>
              </div>
            </div>
          </b-card-group>

          <b-button-group class="md-1">
            <div v-for="page in page_number">
              <div v-if="page==page_number[page_number.length-1] && page % 10 != 0">
                <b-button variant="outline-dark" class="ml-2"
                          v-on:click="start_page=(parseInt(page/10)+1)*10-10;current_page=page">
                  {{ parseInt(page/10) + 1 }}
                </b-button>
              </div>
              <div v-else>
                <b-button variant="outline-dark" class="ml-2"
                          v-on:click="start_page=page-10; current_page=page">{{ parseInt(page/10) }}</b-button>
              </div>
            </div>
          </b-button-group>
        </div>

        <b-modal v-model="review_push"
                 ref="review_modal"
                 title="Review:"
                 @show="resetReviewModal"
                 @hidden="resetReviewModal"
                 @ok="handleReview">

          <b-form-group
            label="Please write your review:"
            label-for="review-content-input"
            invalid-feedback="Can't be empty"
          >
            <b-form-input
              id="review-content-input"
              v-model="review_content.reviewBody"
              required
              placeholder="Your review"
              :state="review_content_state"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label="Please choose star rating:"
            label-for="star-content-input"
            invalid-feedback="Please select a star rating"
          >
            <b-form-radio-group id="star-content-input" v-model="star_value" :options="star_options" :state="star_state">
              <b-form-invalid-feedback :state="star_state">Please select star rating</b-form-invalid-feedback>
              <b-form-valid-feedback :state="star_state">OK</b-form-valid-feedback>
            </b-form-radio-group>
          </b-form-group>

          <b-form-group
            label="Please choose cost rating:"
            label-for="cost-content-input"
          >
            <b-form-radio-group id="cost-content-input" v-model="cost_value" :options="cost_options" :state="cost_state">
              <b-form-invalid-feedback :state="cost_state">Please select cost rating</b-form-invalid-feedback>
              <b-form-valid-feedback :state="cost_state">OK</b-form-valid-feedback>
            </b-form-radio-group>
          </b-form-group>
        </b-modal>
      </div>
    </div>
</template>

<script>
    export default {
        data() {
          return{
            is_default: true,
            img_src_string:"",
            user_username: "",

            review_venue_id: 0,
            star_value: null,
            star_options: [
              { text: '1', value: 1 },
              { text: '2', value: 2 },
              { text: '3', value: 3 },
              { text: '4', value: 4 },
              { text: '5', value: 5 },
            ],

            cost_value: null,
            cost_options: [
              {value: 0, text: 'Free'},
              { value: 1,text: '$'},
              { value: 2,text: '$$'},
              { value: 3,text: '$$$'},
              { value: 4,text: '$$$$'},
            ],

            review_content_state: null,

            review_content: {
              reviewBody: "",
              starRating: 0,
              costRating: 0
            },

            error: "",
            errorFlag: false,

            review_push:false,

            venues: [],
            single_venue:[],
            prepare_venue:[],
            reviews:[],

            latitude: null,
            longitude:null,
            position:null,
            distance_visible: false,

            categories:[{ value: null, text: 'All category' }],
            category_name: "",
            category_selected:null,
            cities: [{ value: null, text: 'All city' }],

            city_selected: null,
            rating_selected: null,
            star_rating_selected: null,
            cost_rating_selected: null,
            venue_key_name:"",
            search_string: "?",

            //page
            page_number:[],
            start_page:0,
            current_page:0,

          }
        },
      computed: {
        star_state() {
          return Boolean(this.star_value)
        },
        cost_state() {
          if(this.cost_value == 0){
            return true
          }
          return Boolean(this.cost_value)
        }
      },
      mounted: function () {
        /**
         * get the location information, if user allowed browser detect the location
         * @type {*|Promise<any>}
         */
        let locationWait = this.getLocation();
        locationWait
          .then( (location) => {
            this.distance_visible = true;
            this.latitude = location[0];
            this.longitude = location[1];
          })
          .catch(function(err) {
            this.distance_visible = false;
          });

        if(this.$route.params.venueId != undefined){
          this.loadSingleVenue(this.$route.params.venueId);
          this.loadReviews(this.$route.params.venueId);
        }

        this.getVenues();
        this.getCategory();
        this.getUserPhoto();
        this.loadUserOwnName();
      },

      methods: {
        /**
         * wait for user choose allowed use location detection or not
         * @param callback
         * @returns {Promise<any>}
         */
          getLocation: function(callback) {
            let promise = new Promise(function(resolve, reject) {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  function(position){
                    resolve([position.coords.latitude, position.coords.longitude])
                  }
                );
              } else {
                reject("Not allowed");
              }
            });
            return promise;
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
          loadUserOwnName: function(){
            this.$http.get('http://127.0.0.1:4941/api/v1/users/'+ this.$cookies.get('userId'))
              .then(function(response){
                this.user_username = response.data.username;
              }, function (error) {
                this.error = error;
              })
          },
        /**
         * review body cannot be empty
         */
          checkReviewContent: function(){
            if(this.review_content.reviewBody.length == 0){
              this.review_content_state = "invalid";
            } else {
              this.review_content_state = "valid";
            }
          },
        /**
         * reset review modal, after user close the review modal
         */
          resetReviewModal: function(){
            this.review_content_state = null;
            this.star_value = null;
            this.cost_value = null;

            this.review_content.reviewBody = "";
            this.review_content.starRating = 0;
            this.review_content.costRating = 0;
          },
        /**
         * handle the review information to the server
         * @param bvModalEvt
         */
          handleReview: function(bvModalEvt){
            bvModalEvt.preventDefault();
            this.postReview()
          },
        /**
         * check user already write the review and choose star and cost ration
         */
          postReview: function (){
            this.checkReviewContent();
            if(this.review_content_state == "invalid"){
              return
            }
            if(this.star_state == false){
              return
            }
            if(this.cost_state == false){
              return
            }
            this.review_content.starRating = this.star_value;
            this.review_content.costRating = this.cost_value;
            this.handlePostReview();
            this.$nextTick(() => {
              this.$refs.review_modal.hide()
            })
            this.switchPage('/reviewLoading')
          },
        /**
         * post review to the server
         */
          handlePostReview: function(){
            this.$http.post('http://127.0.0.1:4941/api/v1/venues/'+ this.review_venue_id + '/reviews',
                            JSON.stringify(this.review_content),
                            {headers: {'X-Authorization': this.$cookies.get('token')}})
              .then(function () {
                alert("Review post success");
              }, function (error) {
                if(error.status == 400){
                  alert("Bad request for venue review!")
                }
                if(error.status == 401){
                  alert("Please log in first");
                }
                if(error.status == 403){
                  alert("You cannot review this venue");
                }
                if(error.status == 404){
                  alert("Cannot find this venue");
                }
              })
          },
        /**
         * get all the venue information
         */
          getVenues: function () {
            this.$http.get('http://127.0.0.1:4941/api/v1/venues')
              .then(function(response){
                this.venues = response.data;
                if(this.venues.length > 10){
                  this.current_page=10
                } else {
                  this.current_page = this.venues.length + 1;
                }
                for(let i=0;i < Math.ceil(this.venues.length/10);i++){
                  if(i == Math.ceil(this.venues.length/10) - 1){
                    this.page_number.push(this.venues.length);
                  } else {
                    this.page_number.push(i * 10 + 10);
                  }
                }
                for(let i = 0;i < this.venues.length;i++){
                  if (this.cities.filter(item=> item.value === this.venues[i].city).length == 0){
                    this.cities.push({ value: this.venues[i].city, text: this.venues[i].city });
                  }
                }
              }, function (error) {
                this.error = error;
                this.errorFlag = true;
              })
          },
        /**
         * get all the category information from server
         */
        getCategory: function(){
            this.$http.get('http://127.0.0.1:4941/api/v1/categories')
              .then(function(response){
                for(let i = 0;i <  response.data.length;i++){
                  this.categories.push({ value: response.data[i], text: response.data[i].categoryName });
                }
              }, function(error){
                this.error = error;
                this.errorFlag = true;
              })
          },
          getCategoryById: function(id){
              for(let i=0;i<this.categories.length;i++) {
               if(i!=0) {
                  if (this.categories[i].value.categoryId == id) {
                    return this.categories[i].value.categoryName;
                  }
               }
              }
            },
          loadSingleVenue: function(id){
            this.$http.get('http://127.0.0.1:4941/api/v1/venues/'+id)
              .then(function(response){
                this.single_venue = response.data;
              }, function(error){
                this.error = error;
                this.errorFlag = true;
            })
          },
          loadReviews: function(id){
            this.$http.get('http://127.0.0.1:4941/api/v1/venues/'+ id + '/reviews')
              .then(function(response){
                this.reviews = response.data;
              }, function(error){
                this.error = error;
                if(this.error.status == 404){
                  this.reviews = [];
                } else {
                  this.errorFlag = true;
                }
            })
         },
        /**
         * after user click search button, prepare the search string for the server
         * @param evt
         */
          search(evt){
            evt.preventDefault();
            if(this.city_selected != null){
              this.search_string = this.search_string + "city=" + this.city_selected + "&";
            }
            if(this.category_selected != null){
              this.search_string = this.search_string + "categoryId=" + this.category_selected.categoryId + "&";
            }
            if(this.rating_selected == null){
              this.search_string = this.search_string + "sortBy=STAR_RATING&";
            } else {
              if(this.rating_selected == "b"){
                this.search_string = this.search_string + "sortBy=STAR_RATING&reverseSort=true&";
              } else if(this.rating_selected == "c"){
                this.search_string = this.search_string + "sortBy=COST_RATING&";
              } else if(this.rating_selected == "d"){
                this.search_string = this.search_string + "sortBy=COST_RATING&reverseSort=true&"
              } else if(this.rating_selected == "e"){
                this.search_string = this.search_string + "sortBy=DISTANCE&" + "myLatitude=" +
                                      this.latitude + "&myLongitude=" + this.longitude + "&";
              } else if(this.rating_selected == "f"){
                this.search_string = this.search_string + "sortBy=DISTANCE&" + "myLatitude=" +
                  this.latitude + "&myLongitude=" + this.longitude + "&reverseSort=true&";
              }
            }
            if(this.star_rating_selected != null && this.star_rating_selected != 'null'){
              this.search_string = this.search_string + "minStarRating=" + this.star_rating_selected + "&"
            }
            if(this.cost_rating_selected != null && this.cost_rating_selected != 'null'){
              this.search_string = this.search_string + "maxCostRating=" + this.cost_rating_selected + "&";
            }
            if(this.venue_key_name!=null && this.venue_key_name.length!=0){
              this.search_string = this.search_string + "q=" + this.venue_key_name + "&"
            }
            this.getSearchVenue(this.search_string);
            this.search_string = "?"
          },
        /**
         * get the all the venues after filter
         * @param search_string
         */
          getSearchVenue:function(search_string){
            this.$http.get('http://127.0.0.1:4941/api/v1/venues/' + search_string)
              .then(function (response) {
                this.prepare_venue = response.data;
                this.venues = this.prepare_venue;

                this.page_number = [];
                this.current_page = 0;
                this.start_page =0;
                if(this.venues.length > 10){
                  this.current_page=10
                } else {
                  this.current_page = this.venues.length + 1;
                }

                for(let i=0;i < Math.ceil(this.venues.length/10);i++){
                  if(i == Math.ceil(this.venues.length/10) - 1){
                    this.page_number.push(this.venues.length);
                  } else {
                    this.page_number.push(i * 10 + 10);
                  }
                }
              },function (error) {
                this.error = error;
                this.errorFlag = true;
              })
          },
          getImageUrl: function(imageId, imageName){
            return "http://127.0.0.1:4941/api/v1/venues/"+ imageId + "/photos/" + imageName;
          },
          getStarRating:function(id){
            for(let i=0;i<this.venues.length;i++){
              if(id == this.venues[i].venueId){
                if(this.venues[i].meanStarRating == null){
                  return 3;
                } else {
                  return this.venues[i].meanStarRating;
                }
              }
            }
          },
          getCostRating:function(id){
            for(let i=0;i<this.venues.length;i++){
              if(id == this.venues[i].venueId){
                if(this.venues[i].modeCostRating == null){
                  return 0;
                } else {
                  return this.venues[i].modeCostRating;
                }
              }
            }
          }
      }
    }
</script>

<style scoped>
</style>
