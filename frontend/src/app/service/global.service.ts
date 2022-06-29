import {
  Injectable
} from '@angular/core';
import { Setting } from '../_models/setting_dto';
import { trap } from '../_models/trap';


@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public static setting:Setting = {
    choice:2
  }
  public static trap: trap = {
    trapPort:162,
    v1trap:true,
    v3trap:true
  }
  public static oid: string;
  public static chosenMIB: {
    name: string;
    oid: string;
    nodetype: string;
    class: string;
    syntax: {
      type: string;
      class: string;

    }
    maxaccess: string;
    status: string;

  };
  set setOid(oid: string) {
    GlobalService.oid = oid
  }
  constructor() {}
}
