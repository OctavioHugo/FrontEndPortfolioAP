import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { DatosPersonalesService } from 'src/app/services/datos-personales.service';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Skill } from 'src/app/models/skill.model';
import { OwnerService } from 'src/app/services/owner.service';

@Component({
  selector: 'app-hard',
  templateUrl: './hard.component.html',
  styleUrls: ['./hard.component.css']
})
export class HardComponent implements OnInit {

  private ownerId: number = 0;

  private recurso: string = 'api/v1/skills' ;

  private recursoSkillByOwner: string = 'api/v1/skills/search?filtro=';

  public skillList: Skill[] = [];

  public userLoged: boolean = false;

  private changeLogin?: Subscription;

  private modal: Modal | undefined;  

  public  formSkill: FormGroup = new FormGroup({});

  constructor(
    private datosPersonalesService: DatosPersonalesService,
    private authorizationService: AuthorizationService,
    private ownerService: OwnerService
  ) {}

  ngOnInit(): void {
    
    this.changeLogin = this.authorizationService.changeLogin$.subscribe(() => 
      this.userLoged = this.authorizationService.getUserLoged());
    
    this.ownerService.disparadorHeader.subscribe(data => {
      this.ownerId = data;
      this.loadData(this.ownerId);
    });

    
    this.formSkill = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      progress: new FormControl('', [Validators.required])
    });
    
    this.modal = new bootstrap.Modal(document.getElementById('skillModal') as HTMLElement, {keyboard: false});
  }

  private loadData(id: number): void {
    this.datosPersonalesService.getData(this.recursoSkillByOwner + id).subscribe(data => 
      this.mapApiModel(data));
  }

  private mapApiModel(data: any): void {
    let newElement: any;
    this.skillList = [];
    data.forEach((element: Skill) => {
      newElement = {
        id: element.id,
        name: element.name,
        progress: element.progress 
      };
      this.skillList.push(newElement);
    });
  }


  public save(): void {
    let url = this.recurso + '/';
    const saveData = {
      id: this.formSkill.value.id,
      name: this.formSkill.value.name,
      progress: this.formSkill.value.progress,
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
    this.formSkill.reset();
    this.formSkill.patchValue({"progress": "0"});
    this.modal?.show();
  }

  updateElement(dataForm: any): void {
    this.formSkill.patchValue({
      id: dataForm.id,
      name: dataForm.name,
      progress: dataForm.progress
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
}
