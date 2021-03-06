import { User } from './../user/user.service';
import { serverAdress } from './../app.config';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class RegisterService {

  options: RequestOptions;

  constructor(private http: Http) { 
    let headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({headers: headers});
  }

  register(b: User): Observable<any>{
    let body = JSON.stringify(b)
    return this.http.post(serverAdress + 'register', body, this.options);
  }
}
