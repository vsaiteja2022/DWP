import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConfigService as ApiService } from '../services/config.service';
import { IUsers } from './playgorund.model';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent implements OnInit {
  allUsers: IUsers[];
  userQuery: string;
  fetchAllUsers_BKUP: IUsers[];
  locationAround: IUsers[];
  userID: number;
  defaultCityName = 'London';
  cityLatitude: number = 51.50722;
  cityLongitude: number = -0.1275;

  $userQuery: Subject<string> = new Subject<string>();

  private cityNameChangedSubscription: Subscription;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cityNameChangedSubscription = this.$userQuery
      .pipe(debounceTime(1500), distinctUntilChanged())
      .subscribe((newCityName) => {
        this.userQuery = newCityName;
        if (newCityName.length > 1 || +newCityName > 1) {
          if (!isNaN(+newCityName)) {
            this.calculateDistance();
          } else {
            this.resolveQueryBasedOnCity(this.userQuery);
          }
        } else {
          this.allUsers = this.fetchAllUsers_BKUP;
        }
      });

    this.getAllUsers();
  }

  /**
   * Makes a GET request to USERS API and retrives all users.
   *
   * @memberof PlaygroundComponent
   */
  getAllUsers(): void {
    this.apiService.fetchUsersList().subscribe((users) => {
      this.allUsers = users;
      this.fetchAllUsers_BKUP = users;
    });
  }

  /**
   * Makes a GET request using userID to get user Details
   *
   * @param {number} [id]
   * @memberof PlaygroundComponent
   */
  getUserDetails(id?: number) {
    this.apiService.getUserDetailsByID(id).subscribe((user) => {
      this.allUsers = [user];
    });
  }

  /**
   * This calculates the distance between two points (given the latitude/longitude of those points).
   * Reference: https://www.geodatasource.com/developers/javascript
   *
   * @param {number} eachLatitude
   * @param {number} eachLongitude
   * @param {number} cityLatitude
   * @param {number} cityLongitude
   *
   * @param {string} [unit]
   * @return {*}  {number}
   */
  public getNearCityUsers(
    eachLatitude: number,
    eachLongitude: number,
    cityLatitude: number,
    cityLongitude: number,
    unit?: string
  ): number {
    if (eachLatitude == cityLatitude && eachLongitude == cityLongitude) {
      return 0;
    } else {
      var radlat1 = (Math.PI * eachLatitude) / 180;
      var radlat2 = (Math.PI * cityLatitude) / 180;
      var theta = eachLongitude - cityLongitude;
      var radtheta = (Math.PI * theta) / 180;
      var distance =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

      if (distance > 1) distance = 1;

      distance = Math.acos(distance);
      distance = (distance * 180) / Math.PI;
      distance = distance * 60 * 1.1515;

      if (unit == 'K') {
        distance = distance * 1.609344;
      }
      if (unit == 'N') {
        distance = distance * 0.8684;
      }

      return distance;
    }
  }

  /**
   * Makes GET request with userQuery to retrives the users that belongs to.
   * userQuery => It takes either string(Location) or number(Miles).
   *
   * @private
   * @param {string} userQuery
   */
  private resolveQueryBasedOnCity(userQuery: string): void {
    this.apiService.resolveQuery(userQuery).subscribe((selectedCityUsers) => {
      this.allUsers = selectedCityUsers;
    });
  }

  /**
   * Method which calculates the distance from static point to all users location.
   * @result will be saved in "locationAround"
   *
   * @private
   */
  private calculateDistance(): void {
    let distance: number;
    this.locationAround = [];

    this.fetchAllUsers_BKUP.forEach((user) => {
      distance = this.getNearCityUsers(
        user.latitude,
        user.longitude,
        this.cityLatitude,
        this.cityLongitude,
        this.userQuery
      );
      if (distance <= +this.userQuery) {
        this.locationAround = [...this.locationAround, user];
      }
    });

    this.allUsers = this.locationAround;
  }
}
