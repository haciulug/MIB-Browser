import {
  Component,
  OnInit
} from '@angular/core';
import {
  GlobalService
} from '../service/global.service'

@Component({
  selector: 'app-box3',
  templateUrl: './box3.component.html',
  styleUrls: ['./box3.component.css']
})

export class Box3Component implements OnInit {
  oid = GlobalService.oid;



  get getAccess() {

    try {
      return GlobalService.chosenMIB.maxaccess;
    } catch {
      return
    }
  }

  get getSyntax() {

    try {
      return GlobalService.chosenMIB.syntax.type;
    } catch {
      return
    }

  }
  get getStatus() {

    try {
      return GlobalService.chosenMIB.status;
    } catch {
      return
    }

  }
  get getOid() {
    return GlobalService.oid;
  }
  
  constructor() {}

  ngOnInit(): void {


  }

}
