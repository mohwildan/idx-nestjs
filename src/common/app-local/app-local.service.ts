import { Injectable } from '@nestjs/common';
import { AppLocalInterface } from '../../interface/app-local.interface';

@Injectable()
export class AppLocalService {
  private data: any = {};

  setData(key: string, value: any) {
    this.data[key] = value;
  }

  getData<T>(key: keyof AppLocalInterface): T {
    return this.data[key];
  }

  getDataAll(): AppLocalInterface {
    return this.data;
  }

  removeData(key: string) {
    delete this.data[key];
  }
}
