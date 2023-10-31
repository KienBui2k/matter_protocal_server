import { Allow, IsNotEmpty } from "class-validator";

export class CreateDeviceDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    userDeviceId: string;
    @Allow()
    node_id: number;
    @IsNotEmpty()
    active:boolean;
    @IsNotEmpty()
    isDeviceOn: boolean;
    @IsNotEmpty()
    power: number;
    // @IsNotEmpty()
    // dayConnect: string;
}