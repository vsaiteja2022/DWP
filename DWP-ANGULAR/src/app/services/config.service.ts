import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API } from './api.endpoints';
import { IUsers } from '../playground/playgorund.model';

@Injectable()
export class ConfigService {
  defaultCityName: string;

  urlForAllUsers: string = `${API.USER_URL}${API.USERS_ABS}`;
  cityWiseUsers: string;

  httpOptions: any = {};

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      }),
    };
  }

  /**
   * ===================================================================================
   *                                  Server Calls start
   * ===================================================================================
   */

  /**
   * Makes a GET request to fetch all users.
   *
   * @return {*}  {Observable<any>}
   */
  public fetchUsersList(): Observable<any> {
    return this.http
      .get(this.urlForAllUsers)
      .pipe(catchError((error) => this.handleError(error, 'ERROR')));
  }

  /**
   * Retrives USER details by passing ID. It's an GET rquest.
   *
   * @param {number} user_id
   *
   * @return {Observable<IUsers>}  {Observable<IUsers>}
   */
  public getUserDetailsByID(user_id: number): Observable<IUsers> {
    return this.http
      .get(`${API.USER_URL}${API.USER}/${user_id}`)
      .pipe(
        catchError((error) => this.handleError(error, 'ERROR'))
      ) as Observable<IUsers>;
  }

  /**
   * Makes a GET request to fetch users by CITY wise.
   *
   * @param {*} cityUsers
   *
   * @return {*}  {Observable<any>}
   */
  public resolveQuery(cityUsers): Observable<any> {
    this.defaultCityName = cityUsers;
    this.setCityUsersURL();

    return this.http
      .get(this.cityWiseUsers)
      .pipe(catchError((error) => this.handleError(error, 'ERROR')));
  }

  /**
   * This handles and ERROR messages.
   *
   * @private
   * @param {HttpEvent<any>} response
   * @param {string} message
   *
   * @return {*}  {Observable<HttpEvent<any>>}
   */
  private handleError(
    response: HttpEvent<any>,
    message: string
  ): Observable<HttpEvent<any>> {
    throw response;
  }

  /**
   * HELPER METHOD: Constucts the "cityWiseUsers" URL to fetch users by city.
   *
   * @private
   */
  private setCityUsersURL(): void {
    this.cityWiseUsers =
      API.USER_URL + `${API.CITY}/${this.defaultCityName}${API.USERS_ABS}`;
  }
}
