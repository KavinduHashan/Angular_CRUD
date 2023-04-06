import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  addUser(data: any): Observable<any> {
    return this.http.post('http://localhost:3000/users', data);
  }

  getAllUserList(): Observable<any> {
    return this.http.get('http://localhost:3000/users');
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/users/${id}`);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`http://localhost:3000/users/${id}`, data);
  }
}
