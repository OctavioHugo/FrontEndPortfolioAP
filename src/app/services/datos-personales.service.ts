import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthorizationService } from './authorization.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatosPersonalesService {
  
  private _refresh$ = new Subject<void>();
  private url: string = environment.url;
  
  constructor(
  private http: HttpClient,
  private authorizationService: AuthorizationService
  ) { }

  get refresh$() {
    return this._refresh$;
  }

  getData(recurso: string): Observable<any> {
    return this.http.get(this.url + recurso);
  } 

  updateData(recurso: string, data: any): Observable<any> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.put(this.url + recurso, data, {
      headers: httpHeaders
    })
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    );
  }

  createData(recurso: string, data: any): Observable<any> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.post(this.url + recurso, data, {
      headers: httpHeaders
    });
  }  

  deleteData(recurso: string) {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.delete(this.url + recurso, {
      headers: httpHeaders
    });
  }

  getHeaders(): HttpHeaders {
    let httpHeaders: HttpHeaders = new HttpHeaders();
    const token = this.authorizationService.getAuth();
    if(token) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer' + token);
    }

    return httpHeaders;
  }


 
}
