import { Component, OnInit } from '@angular/core';
import { elementAt, Subscription } from 'rxjs';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap'
import { Education } from 'src/app/models/education.model';
import { IInstitution } from 'src/app/models/IInstitution.model';
import { ITitle } from 'src/app/models/ITitle.model';
import { OwnerService } from 'src/app/services/owner.service';


@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css']
})
export class EducacionComponent implements OnInit {

  private ownerId: number = 0;

  private recurso: string = "api/v1/educations";

  private recursoEducationByOwner: string ="api/v1/educations/search?filtro=";

  private recursoInstitution: string ="api/v1/intitutions";
  private recursoTitle: string ="api/v1/titles";

  public educationList: Education[] = [];

  public institutionList: IInstitution[] = [];

  public titleList: ITitle[] = [];

  public userLoged: boolean = false;

  private changeLogin?: Subscription;

  private modal: Modal | undefined;

  public  formEducation: FormGroup = new FormGroup({});
  
  constructor(
    private datosPersonalesService: DatosPersonalesService,
    private authorizationService: AuthorizationService,
    private ownerService: OwnerService
  ) { }

  ngOnInit(): void {

    this.changeLogin = this.authorizationService.changeLogin$.subscribe(() => 
    this.userLoged = this.authorizationService.getUserLoged());
   
    this.ownerService.disparadorHeader.subscribe (data => {
      this.ownerId = data;
      this.loadData(this.ownerId);
    });
    
    this.loadInstitution();
    this.loadTitle();

    this.modal = new bootstrap.Modal(document.getElementById('educacionModal') as HTMLElement, {keyboard: false});

    this.formEducation = new FormGroup({
      id: new FormControl(''),
      institution: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      logo: new FormControl(''),
      start: new FormControl('', [Validators.required]),
      end: new FormControl(''),
    });

  
  }

  private loadData(id: number): void {
    this.datosPersonalesService.getData(this.recursoEducationByOwner + id).subscribe(data => 
      this.mapApiModel(data));
  }

  private loadInstitution(): void {
    this.datosPersonalesService.getData(this.recursoInstitution).subscribe(data => 
      this.institutionList = data);
  }
  
  private loadTitle(): void {
    this.datosPersonalesService.getData(this.recursoTitle).subscribe(data => 
      this.titleList = data);
  }

  private mapApiModel(data: any): void {
    let newElement: any;
    this.educationList = [];
    data.forEach((element: Education) => {
      newElement = {
        id: element.id,
        start: element.start,
        end: element.end,
        institution: element.institution,
        title: element.title,
        description: element.description 
      };
      this.educationList.push(newElement);
    });
  }

  public save(): void {
    let url = this.recurso + '/';
    const saveData = {
      id: this.formEducation.value.id,
      start: this.formEducation.value.start,
      end: this.formEducation.value.end,
      description: this.formEducation.value.description,
      institution: {id: this.formEducation.value.institution},
      title: {id: this.formEducation.value.title},
      owner: {id: this.ownerId}
    }
    if(saveData.id) {
      url = url + saveData.id;
      this.datosPersonalesService.updateData(url, saveData).subscribe(() => this.loadData(this.ownerId))
    } else {
      this.datosPersonalesService.createData(url, saveData).subscribe(() => this.loadData(this.ownerId))
    }
    this.modal?.toggle();
  }

  /* HASTA ACA LLEGAMOS*/

  newItem(): void {
    this.formEducation.reset();
    this.modal?.show();
  }

  updateElement(dataForm: any): void {
    this.formEducation.patchValue({
      id: dataForm.id,
      start: dataForm.start,
      end: dataForm.end,
      description: dataForm.description,
      institution: dataForm.institution.id,
      title: dataForm.title.id,
      logo: dataForm.institution.logo
    });
    this.modal?.show();
  }

  deletElement(id: string): void {
    let url = this.recurso + '/' + id;
    this.datosPersonalesService.deleteData(url).subscribe(() => this.loadData(this.ownerId));
  }

  close(): void {
    this.modal?.toggle();
  }

  onSelectInstitution(id: number): void {
    this.institutionList.forEach((element: IInstitution) => {
      if(element.id === Number(id)) {
        this.formEducation.patchValue({
          logo: element.logo
        });
      }
    });
  }
}
