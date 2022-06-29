import {
  Component,
  OnInit
} from '@angular/core';
import {
  ApiService
} from '../service/api.service';
import {
  GlobalService
} from '../service/global.service'
import {
  SnmpVersion
} from '../_enums/snmp-version';
import { takeWhile } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TrapDialogComponent } from '../dialog/trap-dialog/trap-dialog.component';

@Component({
  selector: 'app-box2',
  templateUrl: './box2.component.html',
  styleUrls: ['./box2.component.css']
})

export class Box2Component implements OnInit {

  public static httpRes: [Object] = ['Upload MIB'];
  _httpRes: any;
  _hostname =GlobalService.setting.hostname;
  
  oid = GlobalService.oid;
  value: undefined;
  port = GlobalService.setting.port;
  
  
  stopFlag = false;
  
  setHostname(x:any){
    GlobalService.setting.hostname = x.target.value;
  }
  setPort(x:any){
    GlobalService.setting.port = x.target.value;
  }

  setOid(temp: any) {
    GlobalService.oid = temp.target.value;


  }
  get getHostname(){
    return GlobalService.setting.hostname;
  }

  get getPort(){
    return GlobalService.setting.port;
  }
  get getOid() {
    return GlobalService.oid;
  }
  setStopFlag() {
    this.stopFlag = !this.stopFlag;
    this.stopFlag = !this.stopFlag;    
  }

  trapDialog(){
    this.dialog.open(TrapDialogComponent);
  }

  walkFunc() {





    this._api.postRequest('walk-request', {
      'hostname': GlobalService.setting.hostname,
      'community': GlobalService.setting.community,
      'oid': GlobalService.oid,
      'version': GlobalService.setting.choice === 2 ? SnmpVersion.v2 : SnmpVersion.v3,
      'remote_port': GlobalService.setting.port,
      'security_username': GlobalService.setting.username,
      'auth_password': GlobalService.setting.password,
      'privacy_password':GlobalService.setting.privacy_password,
      'security_level': GlobalService.setting.security_level,
      'auth_protocol': GlobalService.setting.auth_protocol,
      'privacy_protocol': GlobalService.setting.privacy_protocol
    }).pipe(takeWhile(res => res === null, !this.stopFlag))
      .subscribe(res => {





        try {
          Object.values(res).forEach(element => {


            Box2Component.httpRes.push(element['oid'] + ': ' + element['value'])

          });

        } catch {
          Box2Component.httpRes.push("Failed")
        }
        this._httpRes = Box2Component.httpRes;


      })


  }
  setFunc(payload: any) {

    
    this._api.postRequest('set-request', {
      'hostname': GlobalService.setting.hostname,
      'oid': GlobalService.oid,
      'version': GlobalService.setting.choice === 2 ? SnmpVersion.v2 : SnmpVersion.v3,
      'value': payload,      
      'remote_port': GlobalService.setting.port,
      'community': GlobalService.setting.writeCommunity,      
      'security_username': GlobalService.setting.username,
      'auth_password': GlobalService.setting.password,
      'privacy_password':GlobalService.setting.privacy_password,
      'security_level': GlobalService.setting.security_level,
      'auth_protocol': GlobalService.setting.auth_protocol,
      'privacy_protocol': GlobalService.setting.privacy_protocol
    }).pipe(takeWhile(res => res === null, !this.stopFlag))
      .subscribe(res => {
        if (res === true) {
          this.getFunc()
        } else {
          Box2Component.httpRes.push("Failed to set!");
        }
        this._httpRes = Box2Component.httpRes;



      })

  }

  getFunc() {



    this._api.postRequest('get-request', {
      'hostname': GlobalService.setting.hostname,
      'community': GlobalService.setting.community,
      'oid': GlobalService.oid,
      'version': GlobalService.setting.choice === 2 ? SnmpVersion.v2 : SnmpVersion.v3,
      'remote_port': GlobalService.setting.port,
      'security_username': GlobalService.setting.username,
      'auth_password': GlobalService.setting.password,
      'privacy_password':GlobalService.setting.privacy_password,
      'security_level': GlobalService.setting.security_level,
      'auth_protocol': GlobalService.setting.auth_protocol,
      'privacy_protocol': GlobalService.setting.privacy_protocol
    }).pipe(takeWhile(res => res === null, !this.stopFlag)
    ).subscribe(res => {


      try {
        const x = Object.values(res)[0] + ': ' + Object.values(res)[2];
        Box2Component.httpRes.push(x);
      } catch {
        Box2Component.httpRes.push("Failed")
      }
      this._httpRes = Box2Component.httpRes;

    })


  }
  

  constructor(private _api: ApiService, private dialog: MatDialog) {
    
   }

  ngOnInit(): void {
    var objDiv = document.getElementById("output");
    objDiv!.scrollTop = objDiv!.scrollHeight;
   }
}