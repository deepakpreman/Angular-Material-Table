import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {User} from "../model/user";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public api_url = environment.url;

  constructor(private http: HttpClient) { }

//   public getUsers(id, filter, sortDirection,
//     pageIndex, pageSize) {

//     return this.http.get<any>(this.api_url+'/api/users?page='+pageIndex+'&per_page='+pageIndex)
//         .pipe(map(response => {
//             return response;
//         }));
// }

getUsers(
  id:number, filter = '', sortOrder = 'asc',
  pageNumber = 0, pageSize = 3):  Observable<User[]> {

  return this.http.get(this.api_url+'/api/users', {
      params: new HttpParams()
          .set('page', pageNumber.toString())
          .set('pageSize', pageSize.toString())
          .set('id', id.toString())
          .set('filter', filter)
          .set('sortOrder', sortOrder)
  }).pipe(
      map(res =>  res["data"])
  );
}

}
