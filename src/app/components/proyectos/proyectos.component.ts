import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap'
import * as bootstrap from 'bootstrap'
import { Project } from 'src/app/models/project.model';
import { OwnerService } from 'src/app/services/owner.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})

export class ProyectosComponent implements OnInit {

  private ownerId: number = 0;

  private recurso: string = 'api/v1/projects';

  private recursoProjectByOwner: string = 'api/v1/projects/search?filtro='

  public projectList: Project[] = [];
  
  public userLoged: boolean = false;

  private changeLogin?: Subscription;

private modal: Modal | undefined;

;public  formProjects: FormGroup = new FormGroup({});

  constructor(
    private datosPersonalesService: DatosPersonalesService,
    private authorizationService: AuthorizationService,
    private ownerService: OwnerService
  ) { }

  ngOnInit(): void {

    this.changeLogin = this.authorizationService.changeLogin$.subscribe(() =>
     this.userLoged =  this.authorizationService.getUserLoged());

    this.ownerService.disparadorHeader.subscribe(data => {
      this.ownerId = data;
      this.loadData(this.ownerId);
    });

    
    this.formProjects = new FormGroup({
      id: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      photo: new FormControl(''),
      url: new FormControl(''),
    });
    this.modal = new bootstrap.Modal(document.getElementById('proyectoModal') as HTMLElement, {keyboard: false});
  }
  

  private loadData(id: number): void {
    this.datosPersonalesService.getData(this.recursoProjectByOwner + id).subscribe(data => 
      this.mapApiModel(data));
  }

  private mapApiModel(data: any): void {
    let newElement: any;
    this.projectList = [];
    data.forEach((element: Project) => {
      newElement = {
        id: element.id,
        title: element.title,
        description: element.description,
        photo: element.photo,
        url: element.url 
      };
      this.projectList.push(newElement);
    });
  }
  
  public save(): void {
    let url = this.recurso + '/';
    const saveData = {
      id: this.formProjects.value.id,
      title: this.formProjects.value.title,
      description: this.formProjects.value.description,
      photo: this.formProjects.value.photo,
      url: this.formProjects.value.url,
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
    this.formProjects.reset();
    this.modal?.show();
  }

  updateElement(dataForm: any): void {
    this.formProjects.patchValue({
      id: dataForm.id,
      title: dataForm.title,
      description: dataForm.description,
      photo: dataForm.photo,
      url: dataForm.url
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
}
