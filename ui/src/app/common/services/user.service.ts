import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_ENDPOINT = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //fetch current user
  getCurrentUser() {
    return this.http.get(this.API_ENDPOINT + 'user/me');
  }

}
