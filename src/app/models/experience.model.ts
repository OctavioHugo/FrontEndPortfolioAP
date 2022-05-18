import { IPosition } from "./IPosition.model";
import { ICompany } from "./ICompany.model";
import { IMode } from "./IMode.model";

export class Experience {

    public id: string;
    public start: string;
    public end: string;
    public duration: string;
    public description: string;

    public position: IPosition;
    public company: ICompany;
    public mode: IMode;

    constructor() {
        this.id = '';
        this.start = '';
        this.end = '';
        this.duration = '';
        this.description = ''; 

        this.position = {
            id: 0,
            name: ''
        }

        this.company = {
            id: 0,
            name: '',
            logo: ''
        }

        this.mode = {
            id: 0,
            name: ''
        }
    }
}
