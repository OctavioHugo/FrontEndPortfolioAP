import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Experience } from 'src/app/models/experience.model';
import { IPosition } from 'src/app/models/IPosition.model';
import { ICompany } from 'src/app/models/ICompany.model';
import { IMode } from 'src/app/models/IMode.model';
import { OwnerService } from 'src/app/services/owner.service';


@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css']
})
export class ExperienciaComponent implements OnInit {

  private ownerId: number = 0;

  private recurso: string = "api/v1/experiences";

  private recursoExperienceByOwner: string ="api/v1/experiences/search?filtro=";

  private recursoPosition: string = "api/v1/positions";
  private recursoCompany: string = "api/v1/companies";
  private recursoMode: string = "api/v1/modes";

  public experienceList: Experience[] = [];

  public positionList: IPosition[] = [];
  public companyList: ICompany[] = [];
  public modeList: IMode[] = [];

  public userLoged: boolean = false;

  private changeLogin?: Subscription;

  private modal: Modal | undefined;  

  public  formExperiencia: FormGroup = new FormGroup({});

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

    this.loadPosition();

    this.loadCompany();

    this.loadMode();

    this.formExperiencia = new FormGroup({
      id: new FormControl(''),
      start: new FormControl('', [Validators.required]),
      end: new FormControl(''),
      duration: new FormControl(''),
      description: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      company: new FormControl('', [Validators.required]),
      logo: new FormControl(''),
      mode: new FormControl('', [Validators.required])
    });

    this.modal = new bootstrap.Modal(document.getElementById('experienciaModal') as HTMLElement, {keyboard: false});
  }
    
    private loadData(id: number): void {
      this.datosPersonalesService.getData(this.recursoExperienceByOwner + id).subscribe(data => { 
        this.mapApiModel(data);
      });
    }

    private loadPosition(): void {
      this.datosPersonalesService.getData(this.recursoPosition).subscribe(data => {
        this.positionList = data;
      });
    } 

    private loadCompany(): void {
      this.datosPersonalesService.getData(this.recursoCompany).subscribe(data => {
        this.companyList = data;
      });

    }

    private loadMode(): void {
      this.datosPersonalesService.getData(this.recursoMode).subscribe(data => {
        this.modeList = data;
      });
    }
  
    private mapApiModel(data: any): void {
      let newElement: any;
      this.experienceList = [];
      data.forEach((element: Experience) => {
        newElement = {
          id: element.id,
          start: element.start,
          end: element.end,
          duration: element.duration,
          description: element.description,
          company: element.company,
          mode: element.mode,
          position: element.position 
        };
        this.experienceList.push(newElement);
      });

    }

    public save(): void {
      let url = this.recurso + '/';
      
      const saveData = {
        id: this.formExperiencia.value.id,
        start: this.formExperiencia.value.start,
        end: this.formExperiencia.value.end,
        duration: this.formExperiencia.value.duration,
        description: this.formExperiencia.value.description,
        company: {id: this.formExperiencia.value.company},
        mode: {id: this.formExperiencia.value.mode},
        position: {id: this.formExperiencia.value.position},
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

    newItem(): void {
      this.formExperiencia.reset();
      this.modal?.show();
    }

    updateElement(dataForm: any): void {
      this.formExperiencia.patchValue({
        id: dataForm.id,
        start: dataForm.start,
        end: dataForm.end,
        duration: dataForm.duration,
        description: dataForm.description,
        company: dataForm.company.id,
        mode: dataForm.mode.id,
        position: dataForm.position.id,
        logo: dataForm.company.logo
      });
      this.modal?.show();
    }

    deletElement(id: string): void {
      let url = this.recurso + '/' + id
      this.datosPersonalesService.deleteData(url).subscribe(() => this.loadData(this.ownerId));
    }

    close(): void {
      this.modal?.toggle();
    }


    onSelectCompany(id: number): void {
      this.companyList.forEach((element: ICompany) => {
        if(element.id === Number(id)) {
          this.formExperiencia.patchValue({
            logo: element.logo
          });
        }
      });
    }  
  }
