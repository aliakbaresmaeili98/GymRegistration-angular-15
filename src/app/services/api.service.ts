import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { Observable } from 'rxjs';
import { User } from '../models/user.mode';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'http://localhost:3000/enquiry';

  constructor(private http: HttpClient) {}

  postRegistration(registerObj: User) {
    return this.http.post<User[]>(`${this.baseUrl}`, registerObj);
  }

  getRegisterUser() {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  updateRegisterUser(registerObj: User, id: number) {
    return this.http.put<User>(`${this.baseUrl}/${id}`, registerObj);
  }

  deleteRegisterd(id: number) {
    return this.http.delete<User>(`${this.baseUrl}/${id}`);
  }

  getRegisterUserId(id: number): Observable<User> {
   return this.http.get<User>(`${this.baseUrl}/${id}`);
  }
}
