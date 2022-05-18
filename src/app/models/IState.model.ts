import { ICountry } from "./ICountry.model";

export interface IState {
    id: number;
    name: string;
    country: ICountry;
}