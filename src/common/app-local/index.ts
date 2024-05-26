import { Injectable } from '@nestjs/common';
import { CostumeHeader } from '../types/costume_header.type';

//class for set data in local app
@Injectable()
export class AppLocals {
  private data: any = {};

  setData(key: string, value: any) {
    this.data[key] = value;
  }

  getData<T>(key: keyof CostumeHeader): T {
    return this.data[key];
  }

  getDataAll(): CostumeHeader {
    return this.data;
  }

  removeData(key: string) {
    delete this.data[key];
  }
}
