import {CanActivateFn, Router} from "@angular/router";
import {inject} from '@angular/core';
import {catchError, map, of} from "rxjs";
import {HttpClient} from "@angular/common/http";

export const authGuard: CanActivateFn = () => {
  let httpClient : HttpClient = inject(HttpClient);
  let router = inject(Router);
  const url = 'http://localhost:8080/api/v1/auth/readJWTCookie';

  return httpClient.get<{ isConnected: boolean }>(url, { withCredentials: true }).pipe(
    map((response) => {
      const isConnected = response.isConnected;
      if(!isConnected) {
        router.navigateByUrl('/');
      }
      return isConnected; // Return true or false based on the response
    }),
    catchError((error) => {
      console.log('Error making GET request:', error);
      return of(false); // Handle the error by returning false
    })
  );
}

