import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { Owner } from 'src/app/models/owner.model';
import { IPosition } from 'src/app/models/IPosition.model';
import { ICountry } from 'src/app/models/ICountry.model';
import { IState } from 'src/app/models/IState.model';
import { OwnerService } from 'src/app/services/owner.service';
import { ICity } from 'src/app/models/ICity.model';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.css']
})
export class AcercaDeComponent implements OnInit {

  private ownerID: number = 0;

  private recurso: string = "api/v1/owners";

  private recursoPosition: string = "api/v1/positions"
  private recursoCountry: string = "api/v1/countries"
  private recursoState: string = "api/v1/states/search?filtro="
  private recursoCity: string = "api/v1/cities/search?filtro="

  public owner: Owner = new Owner();

  public positionList: IPosition[] = []; 
  public countryList: ICountry[] = [];
  public stateList: IState[] = [];
  public cityList: ICity[] = [];

  public ubication: string = '';

  public datosPersonales: any;

  private modal: Modal | undefined; 

  public formDatosPersonales: FormGroup = new FormGroup({});

  public userLoged: boolean = false;


  private changeLogin?: Subscription;

  constructor(
    private personalDataService: DatosPersonalesService,
    private authorizationService: AuthorizationService,
    private ownerService: OwnerService
  ) { }

  ngOnInit(): void {
    
    this.changeLogin = this.authorizationService.changeLogin$.subscribe(() => 
      this.userLoged = this.authorizationService.getUserLoged());
    
    this.ownerService.disparadorHeader.subscribe(data => {
      this.loadData(data);
    });

    this.loadPosition();

    this.loadCountry();

    this.formDatosPersonales = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      actualPosition: new FormControl('', [Validators.required]),
      ubicationCountry: new FormControl('', [Validators.required]),
      ubicationState: new FormControl('', [Validators.required]),
      ubicationCity: new FormControl('', [Validators.required]),
      about: new FormControl(''),
      photo: new FormControl(''),
      facebook: new FormControl(''),
      twitter: new FormControl(''),
      instagram: new FormControl('')
    });

    this.modal = new bootstrap.Modal(document.getElementById("acercaDeModal") as HTMLElement, {keyboard: false})
  }

  private loadData(id: number): void {
    this.personalDataService.getData(this.recurso + '/' + id).subscribe(data => {
      this.mapApiModel(data);
      this.loadState(this.owner.city.state.country.id);
      this.loadCity(this.owner.city.state.id);
    });
  }

  private loadPosition(): void {
    this.personalDataService.getData(this.recursoPosition).subscribe(data => {
      this.positionList = data;
    });
  }

  private loadCountry(): void {
    this.personalDataService.getData(this.recursoCountry).subscribe( data => {
      this.countryList = data;
    });
  }

  private loadState(id: number): void {
    this.personalDataService.getData(this.recursoState + id).subscribe( data => {
      this.stateList = data;
    });
  }

  private loadCity(id: number): void {
    this.personalDataService.getData(this.recursoCity + id).subscribe( data => {
      this.cityList = data;
    });
  }

  private mapApiModel(data: any) {
    this.owner.id = data.id;
    this.owner.name = data.name;
    this.owner.photo = data.photo;
    this.owner.about = data.about;
    this.owner.facebook = data.facebook;
    this.owner.twitter = data.twitter;
    this.owner.instagram = data.instagram;
    this.owner.position = data.position;
    this.owner.city = data.city;
  }

  openModal(): void {
    this.formDatosPersonales.patchValue({
      id: this.owner.id,
      name: this.owner.name,
      actualPosition: this.owner.position.id,
      ubicationCountry: this.owner.city.state.country.id,
      ubicationState: this.owner.city.state.id,
      ubicationCity: this.owner.city.id,
      about: this.owner.about,
      photo: this.owner.photo,
      facebook: this.owner.facebook,
      instagram: this.owner.instagram,
      twitter: this.owner.twitter
    });
    this.modal?.show();
  }

  onSelectCountry(id: number) : void {
    this.loadState(id);
  }

  onSelectState(id: number) : void {
    this.loadCity(id);
  }

  saveChange(): void {
    const saveData = {  
    id: this.formDatosPersonales.value.id,
    name: this.formDatosPersonales.value.name,
    photo: this.formDatosPersonales.value.photo,
    about: this.formDatosPersonales.value.about,
    facebook: this.formDatosPersonales.value.facebook,
    twitter: this.formDatosPersonales.value.twitter,
    instagram: this.formDatosPersonales.value.instagram,
    position: {id: this.formDatosPersonales.value.actualPosition},
    city: {id: this.formDatosPersonales.value.ubicationCity}
    }
    
    this.personalDataService.updateData(this.recurso + '/' + saveData.id, saveData).subscribe(data => {
      this.mapApiModel(data);
    });
    this.modal?.toggle();
  }

  close(): void {
    this.modal?.toggle();
  }
}
