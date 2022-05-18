import { ICity } from "./ICity.model";
import { IPosition } from "./IPosition.model";

export class Owner {

    public id: number;
    public name: string;
    public photo: string;
    public about: string;
    public facebook: string;
    public twitter: string;
    public instagram: string;

    public position: IPosition;
    public city: ICity;

    constructor() {
        this.id = 0;
        this.name = '';
        this.photo = '';
        this.about = '';
        this.facebook = '';
        this.twitter = '';
        this.instagram = '';
        this.position = {
            id: 0,
            name: ''
        };
        this.city = {
            id: 0,
            name: '',
            state: {
                id: 0,
                name: '',
                country: {
                    id: 0,
                    name: ''
                }
            }
        };
    }

    get ubication(): string {
        return this.city.name + ' - ' + this.city.state.name + ' - ' + this.city.state.country.name;
    }
}

