import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  @Output() disparadorHeader: EventEmitter<any> = new EventEmitter();

  constructor() { }
}
