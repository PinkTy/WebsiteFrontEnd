<template>
  <div style="position: relative; top: -50px;">
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <img alt="venuePage" v-bind="{width: 35, height: 35}" style="float:left" class="ml-1 mr-2" :src="require('../assets/myVenue.png')">
    <b-navbar-brand class="ml-2">My Venue</b-navbar-brand>
  </b-navbar>

  <b-container>
    <b-row class="mb-xl-5">
    </b-row>
    <b-row class="mb-xl-5">
    </b-row>
    <b-row class="mb-xl-5">
    </b-row>
    <b-row align-h="center">
      <b-col>
        <b-spinner label="Spinning"></b-spinner>
        <b-spinner type="grow" label="Spinning"></b-spinner>
      </b-col>
    </b-row>
  </b-container>
  </div>
</template>

<script>
    export default {
        name: "venuePicLoading",
        mounted() {
          setTimeout( () => {
            this.switchPage("/users/"+this.$cookies.get('userId') + '/updateVenuePic/' + this.$cookies.get('venueId'))
          }, 1000);
      }
    }
</script>

<style scoped>

</style>
