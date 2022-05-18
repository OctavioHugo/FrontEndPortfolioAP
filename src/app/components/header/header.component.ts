import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap'; 
import { AuthorizationService } from 'src/app/services/authorization.service';
import { Subscription } from 'rxjs';
import { Owner } from 'src/app/models/owner.model';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';
import { OwnerService } from 'src/app/services/owner.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public loginFail: boolean = false;

  private recurso: string = 'api/v1/owners'

  public formLogin: FormGroup = new FormGroup({});

  public owner: Owner = new Owner();

  subscription?: Subscription;

  public socialNetworks: any;

  private modal: Modal | undefined; 

  public buttonText: string = "Login";

  public userLoged: boolean = false;

  // private changeLogin?: Subscription;

  constructor(
    private authorizationService: AuthorizationService,
    private datosPersonalesService: DatosPersonalesService,
    private ownerService: OwnerService
  ) { }

  ngOnInit(): void {
    this.loadData();
    
    this.subscription = this.datosPersonalesService.refresh$.subscribe(() => {
      this.loadData();
    });
    
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
    /*
    this.changeLogin = this.authorizationService.changeLogin$.subscribe(() => 
    */
    this.modal = new bootstrap.Modal(document.getElementById('login') as HTMLElement, {keyboard: false});
  }

  private loadData(): void {
    this.datosPersonalesService.getData(this.recurso).subscribe(data => {
      this.owner.id = data[0].id;
      this.socialNetworks = {
        "facebook": data[0].facebook,
        "twitter": data[0].twitter,
        "instagram": data[0].instagram
      };
      this.ownerService.disparadorHeader.emit(this.owner.id);
    });
  }

  open(): void {
    if(this.authorizationService.getAuth()) {
      this.authorizationService.removeAuth();
      this.buttonText = "Login"
    } else {
      this.loginFail = false;
      this.formLogin.reset();
      this.modal?.show();
    }
    
  }

  login(): void {
    const userLogin = {
      userName: this.formLogin.value.email,
      password: this.formLogin.value.password
    }
    this.authorizationService.login(userLogin).subscribe({
      next: (res) => {
        this.authorizationService.setAuth(res.token);
        this.buttonText = "Logout";
        this.modal?.toggle();
      },
      error: () => this.loginFail = true
    });
  }

  get Email() {
    return this.formLogin.get('email');
  }

  get Password() {
    return this.formLogin.get('password');
  }
}
