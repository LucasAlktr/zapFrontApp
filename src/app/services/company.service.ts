import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  createCompany(data: any): Observable<any> {
    return this.http.post('http://localhost:8000/api/companies/create_company/', data);
  }

  updateCompany(id: number, data: any): Observable<any> {
    return this.http.put(`http://localhost:8000/api/companies/${id}/update/`, data);
  }

  listCompanies(): Observable<any> {
    return this.http.get('http://localhost:8000/api/companies/');
  }

  getCompanyDetail(id: number): Observable<any> {
    return this.http.get(`http://localhost:8000/api/companies/${id}/`);
  }

  deleteCompany(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/companies/${id}/`);
  }
}
