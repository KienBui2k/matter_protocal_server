import { Allow, IsNotEmpty } from "class-validator";

export class CreateDeviceDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    user_device_id: string;
    @IsNotEmpty()
    node_id: number;
    @IsNotEmpty()
    status: string;
    @IsNotEmpty()
    power: number;
    @IsNotEmpty()
    dayConnect: string;
}