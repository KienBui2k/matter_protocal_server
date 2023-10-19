import { Allow, IsEmail, IsBoolean, IsEnum } from "class-validator";
export class UpdateDeviceDto {
    @Allow()
    name: string;
}