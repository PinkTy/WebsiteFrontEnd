<template>
  <div style="position: relative; top: -50px;">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand style="text-align:left;" class="ml-1">
        <img alt="homepage" style="width: 5%;float:left" class="ml-1 mr-2" :src="require('../assets/homepage.png')">
        Homepage
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav tabs>
          <b-nav-item right>
            Find Venue
          </b-nav-item>
        </b-nav>
      </b-navbar-nav>
      <b-navbar-nav>
        <b-nav tabs>
          <b-nav-item>
            Login
          </b-nav-item>
        </b-nav>
      </b-navbar-nav>

      <b-navbar-nav>
        <b-nav tabs>
          <b-nav-item>
            Register
          </b-nav-item>
        </b-nav>
      </b-navbar-nav>
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
      name: "HomePageLoading",
      mounted() {
        setTimeout( () => {
          this.switchPage("/")
        }, 1500);
      }
    }
</script>

<style scoped>

</style>
