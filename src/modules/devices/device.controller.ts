import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Response } from 'express';

interface Data {
  message_id: string
  result: NodeId[]
}
interface NodeId {
  node_id: number;
}
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) { }
  @Post()
  async create(@Body() createDeviceDto: CreateDeviceDto, @Res() res: Response) {

    try {
      let name = await this.deviceService.findbyname(createDeviceDto.name)
      console.log('name', name);
      if (name.status) {

        console.log('name', name);

        return res.status(name.status ? 200 : 213).json({
          message: 'same name',
          data: null
        })
      } else {
        let data1 = await this.deviceService.getData({
          "message_id": "5",
          "command": "get_nodes"
        }) as Data;
        console.log('vao r');
        console.log("dataaaaaaaaa", data1?.result[0].node_id);
        if (data1) {
          createDeviceDto.node_id = data1.result[0].node_id;
          let [status, message, data] = await this.deviceService.create(createDeviceDto);
          return res.status(status ? 200 : 213).json({
            message,
            data
          })
        }
      }
    } catch (err) {
      console.log("🚀 ~ file: device.controller.ts:52 ~ DeviceController ~ create ~ err:", err);
      return res.status(500).json({
        message: "Controller error11111!"
      })
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      let [status, message, data] = await this.deviceService.findAll();
      return res.status(status ? 200 : 213).json({
        message,
        data
      })
    } catch (err) {
      return res.status(500).json({
        message: "Controller error!"
      })
    }
  }

  @Get(':id')
  async findId(@Param('id') id: string, @Res() res: Response) {
    try {
      let socketDataNodeId = await this.deviceService.getData({
        "message_id": "5",
        "command": "get_nodes"
      })
      console.log('socketDataNodeId',socketDataNodeId);
      
      return
      let socketDataOnOff = await this.deviceService.getData({
        "message_id": "3",
        "command": "device_command",
        "args": {
          "node_id": 12,
          "endpoint_id": 1,
          "cluster_id": 6, //OnOff
          "command_name": "Toggle",// On,Off or Toggle
          "payload": {}
        }
      })
      let data = await this.deviceService.findbyId(id);
      console.log('idsssssssssss', data);
      return res.status(data.status ? 200 : 213).json({
        message: 'tun on/off',
        data: data.data
      })
    } catch (err) {
      return res.status(500).json({
        message: "Controller error!"
      })
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.deviceService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deviceService.delete(id);
  }
}
