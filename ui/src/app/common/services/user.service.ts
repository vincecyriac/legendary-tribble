import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_ENDPOINT = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //fetch current user
  getCurrentUser(): Observable<any> {
    return this.http.get(this.API_ENDPOINT + 'user/me');
  }

  //send message 
  sendMessage(message : any): Observable<any> {
    return this.http.post(this.API_ENDPOINT + 'message/', {
      message: message,
      conv_id : "62258e87ec6562679206506b"
    });
  }

  //get all messages
  getMessages(): Observable<any> {
    return this.http.get(this.API_ENDPOINT + 'message/');
  }
}
