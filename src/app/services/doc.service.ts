import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { CompanyService } from './company.service';


@Injectable({
  providedIn: 'root',
})
export class DocService {
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private companyService: CompanyService
  ) {}

  createDoc(data: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/docs/create_doc/', data);
  }

  updateDoc(id: number, data: any): Observable<any> {
    return this.http.put(`http://localhost:8000/api/docs/${id}/update/`, data);
  }

  listDocs(): Observable<any> {
    return this.http.get('http://localhost:8000/api/docs/');
  }

  getDocDetail(id: number): Observable<any> {
    return this.http.get(`http://localhost:8000/api/docs/${id}/`);
  }

  deleteDoc(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/docs/${id}/`);
  }
}
