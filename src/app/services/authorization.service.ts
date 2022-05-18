import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private url: string = environment.url;
  
  private recurso: string = "auth/login"

  private changeLoginSource= new Subject<void>();
  public changeLogin$ = this.changeLoginSource.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }


  login(userLogin: any): Observable<any> {
    this.removeAuth();
    return this.http.post(this.url + this.recurso, userLogin);
  }

  
  setAuth(token: string): void {
    this.storageService.store('token', token);
    this.changeLoginSource.next();
  }

  getAuth(): any {
    return this.storageService.retrieve('token');
  }

  removeAuth(): void {
    this.storageService.remove('token');
    this.changeLoginSource.next();
  }
  
  getUserLoged(): boolean {
    return this.getAuth() ? true : false;
  }

}
