<template>
  <!-- Title of the page-->
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>

  <div>
    <div v-if="allUsers.length < 1">
      <label>No records found!<br /></label>
      <label
        >Your typed query is: {{ userQuery }}
        {{ isNumber() ? " Miles" : "city" }}</label
      >
    </div>

    <div class="userQueryArea">
      <div>
        <input
          v-if="allUsers.length > 1"
          class="cityName"
          type="search"
          name="userIDField"
          v-model="userQuery"
          placeholder="Enter City or Miles"
        />
        <button
          v-if="userQuery && allUsers.length > 1"
          id="userQueryValue"
          type="button"
          name="userBTN"
          :onclick="resolveQuery"
        >
          Fetch users
        </button>
      </div>
      <div>
        <input
          class="cityName"
          type="search"
          name="fetchUserDetails"
          v-model="userDetailsByID"
          placeholder="Enter userID to get more details"
        />
        <button
          type="button"
          name="userDetails"
          :onclick="fetchMoreUserDetails"
        >
          User Info
        </button>
      </div>
    </div>
  </div>

  <button
    style="float: right; margin-right: 10%"
    id="initialLoad"
    type="button"
    name="refresh"
    :onclick="initialState"
  >
    Refresh
  </button>

  <div id="main">
    <div
      v-for="user of allUsers"
      :key="user.id"
      :class="{
        colorExt: userDetailsByIDBtn,
      }"
    >
      <span
        v-if="userDetailsByID > 0 && userDetailsByIDBtn"
        class="textWeight"
        style="margin-right: 15px"
        >user ID: {{ user.id }}</span
      >
      <span v-if="userDetailsByID > 0 && userDetailsByIDBtn" class="textWeight"
        >City: {{ user.city }}</span
      >
      <br />
      <span class="textWeight">First Name:</span> {{ user.first_name }}<br />
      <span class="textWeight">Last Name:</span> {{ user.last_name }}<br />
      <span class="textWeight">Email:</span> {{ user.email }}<br />
      <span v-if="userDetailsByID > 0 && userDetailsByIDBtn" class="textWeight"
        >Latitude: {{ user.latitude }}</span
      >
      <br />
      <span v-if="userDetailsByID > 0 && userDetailsByIDBtn" class="textWeight"
        >Longitude: {{ user.longitude }}</span
      >
      <br />
      <span v-if="userDetailsByID > 0 && userDetailsByIDBtn" class="textWeight"
        >IP Address: {{ user.ip_address }}</span
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PlayGround",
  data() {
    return {
      allUsers: [],
      userID: null,
      userQuery: null,
      fetchAllUsers_BKUP: [],
      locationAround: null,
      defaultCityName: "London",
      cityLatitude: 51.50722,
      cityLongitude: -0.1275,
      cityWiseUsersURL: "",
      userDetailsByID: null,
      userDetailsByIDBtn: false,
    };
  },
  props: {
    msg: String,
  },
  created() {
    this.getAllUsers();
  },
  methods: {
    getAllUsers() {
      axios
        .get("https://bpdts-test-app.herokuapp.com/users")
        .then((response) => {
          this.allUsers = response.data;
          this.fetchAllUsers_BKUP = response.data;
        });
    },
    getCityUsers() {
      this.setcityWiseUsers();

      axios.get(this.cityWiseUsersURL).then((response) => {
        console.log(">>", response.data);
        this.allUsers = response.data;
      });
    },
    resolveQuery() {
      if (this.isNumber()) {
        this.calculateDistance();
      } else {
        this.getCityUsers();
      }
    },
    calculateDistance() {
      let distance;
      this.locationAround = [];

      this.fetchAllUsers_BKUP.forEach((user) => {
        distance = this.getNearCityUsers(
          user.latitude,
          user.longitude,
          this.cityLatitude,
          this.cityLongitude,
          this.userQuery
        );
        if (distance <= this.userQuery) {
          this.locationAround = [...this.locationAround, user];
        }
      });
      this.allUsers = this.locationAround;
    },
    getNearCityUsers(
      eachLatitude,
      eachLongitude,
      cityLatitude,
      cityLongitude,
      unit
    ) {
      if (eachLatitude == cityLatitude && eachLongitude == cityLongitude) {
        return 0;
      } else {
        let radlat1 = (Math.PI * eachLatitude) / 180;
        let radlat2 = (Math.PI * cityLatitude) / 180;
        let theta = eachLongitude - cityLongitude;
        let radtheta = (Math.PI * theta) / 180;
        let distance =
          Math.sin(radlat1) * Math.sin(radlat2) +
          Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

        if (distance > 1) distance = 1;

        distance = Math.acos(distance);
        distance = (distance * 180) / Math.PI;
        distance = distance * 60 * 1.1515;

        if (unit == "K") {
          distance = distance * 1.609344;
        }
        if (unit == "N") {
          distance = distance * 0.8684;
        }

        return distance;
      }
    },
    setcityWiseUsers() {
      this.cityWiseUsersURL = `https://bpdts-test-app.herokuapp.com/city/${this.userQuery}/users`;
    },
    initialState() {
      // RESET
      this.userQuery = null;
      this.userDetailsByID = null;
      this.userDetailsByIDBtn = false;
      this.allUsers = this.fetchAllUsers_BKUP;
    },
    isNumber() {
      return !isNaN(this.userQuery);
    },
    fetchMoreUserDetails() {
      if (this.userDetailsByID) {
        axios
          .get(
            `https://bpdts-test-app.herokuapp.com/user/${this.userDetailsByID}`
          )
          .then((response) => {
            this.userDetailsByIDBtn = true;
            this.allUsers = [response.data];
          });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

#main div {
  background-color: #ebe8e8;
  width: 24%;
  height: 100px;
  margin: 6px;
}

.textWeight {
  font-weight: 600;
}

.cityName {
  border: none;
  appearance: none;
  padding: 12px;
  border-radius: 5px;
  width: 250px;
  font-size: 14px;
  margin-right: 15px;
  border-bottom: 2px solid grey;
}

.hello {
  text-align: left;
}

.userQueryArea {
  display: flex;
  gap: 15px;
  justify-content: space-around;
}

button {
  background-color: #e4e4e4;
  color: black;
  padding: 10px 25px;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

.colorExt {
  height: 200px !important;
}
</style>
