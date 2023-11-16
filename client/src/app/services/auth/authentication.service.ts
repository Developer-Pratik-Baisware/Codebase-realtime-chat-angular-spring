import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  registerUser(username: string, email: string, password: string) : Observable<HttpResponse<any>> {
    const url = 'http://localhost:8080/api/v1/auth/register';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      username: username,
      email: email,
      password: password
    };

    return this.http.post(url, body, { headers, observe: 'response', withCredentials: true});
  }

  loginUser(usernameOrEmail: string, password: string) : Observable<HttpResponse<any>> {
    const url = 'http://localhost:8080/api/v1/auth/login';

    const headers = new HttpHeaders({
      'Content-type' : 'application/json'
    });

    const body = {
      usernameOrEmail : usernameOrEmail,
      password : password
    };

    return this.http.post(url, body, {headers, observe: 'response', withCredentials: true});
  }
}
