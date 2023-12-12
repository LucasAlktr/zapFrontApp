import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  createUser(data: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/users/create_user/', data);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`http://localhost:8000/api/users/${id}/update/`, data);
  }

  listUsers(): Observable<any> {
    return this.http.get('http://localhost:8000/api/users/');
  }

  getUserDetail(id: number): Observable<any> {
    return this.http.get(`http://localhost:8000/api/users/${id}/`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/users/${id}/`);
  }
}
