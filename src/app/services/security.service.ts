import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private IsAuthorized: any;
  private authSourse = new Subject<boolean>();
  private authChallenge$ = this.authSourse.asObservable(); 

  constructor(private storageService: StorageService) { 
    if(this.storageService.retrieve('IsAuthorized') !== '') {
      this.IsAuthorized = this.storageService.retrieve('IsAuthorized');
      this.authSourse.next(true);
    }
  }

  public GetToken(): any {
    return this.storageService.retrieve('authData');
  }

  public ResetAuthData() {
    this.storageService.store('authData', '');
    this.IsAuthorized = false;
    this.storageService.store('IsAuthorized', false);
  }

  public SetAuthData(token: any) {
    this.storageService.store('authData', token);
    this.IsAuthorized = true;
    this.storageService.store('IsAuthorized', true);
    this.authSourse.next(true);
  }

  public LogOff() {
    this.ResetAuthData();
    this.authSourse.next(true);
  }
}
