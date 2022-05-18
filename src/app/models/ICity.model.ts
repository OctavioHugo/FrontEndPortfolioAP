import { IState } from "./IState.model";

export interface ICity {
    id: number;
    name: string;
    state: IState;
}