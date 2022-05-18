import { IInstitution } from "./IInstitution.model";
import { ITitle } from "./ITitle.model";

export class Education {

    public id: string;
    public description: string;
    public start: string;
    public end: string;
    public institution: IInstitution;
    public title: ITitle;

    constructor() {
        this.id = '';
        this.start = '';
        this.end = '';
        this.description = '';

        this.institution = {
            id: 0,
            name: '',
            logo: ''
        }

        this.title = {
            id: 0,
            name: ''
        }
    }
}
