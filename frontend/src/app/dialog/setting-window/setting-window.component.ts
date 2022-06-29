import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app//service/api.service';
import { Box2Component } from 'src/app/box2/box2.component';
import {
  GlobalService
} from 'src/app/service/global.service';


@Component({
  selector: 'app-setting-window',
  templateUrl: './setting-window.component.html',
  styleUrls: ['./setting-window.component.css']
})
export class SettingWindowComponent implements OnInit {


  /* settingForm = new FormGroup({

    choice2: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    security_level: new FormControl(''),
    auth_protocol: new FormControl('')


  }); */
  settingForm: FormGroup | undefined;
  errorFlag: boolean = false;

  ngOnInit(): void {

    this.settingForm = this.formBuilder.group({
      choiceControl: [''],
      hostnameControl: [''],
      portControl: [''],
      community: [''],
      writeCommunity: [''],
      usernameControl: [''],
      passwordControl: [''],
      security_levelControl: [''],
      auth_protocolControl: [''],
      privacy_password: [''],
      privacy_protocolControl:['']

    })



  }

  constructor(private formBuilder: FormBuilder, private _api: ApiService, private dialog: MatDialog) {

  }
  get choiseControl() {
    return this.settingForm?.get('choiceControl')
  }
  async updateSetting() {
  
    const flag = await this.checkConn();
    if (flag === true) {
      console.log(flag);


      GlobalService.setting = {
        hostname: this.settingForm?.get('hostnameControl')?.value,
        port: this.settingForm?.get('portControl')?.value,
        choice: this.settingForm?.get('choiceControl')?.value,
        community: this.settingForm?.get('community')?.value,
        writeCommunity: this.settingForm?.get('writeCommunity')?.value,
        username: this.settingForm?.get('usernameControl')?.value,
        password: this.settingForm?.get('passwordControl')?.value,
        privacy_password: this.settingForm?.get('privacy_password')?.value,
        security_level: this.settingForm?.get('security_levelControl')?.value,
        auth_protocol: this.settingForm?.get('auth_protocolControl')?.value,
        privacy_protocol:this.settingForm?.get('privacy_protocolControl')?.value

      }
      this.dialog.closeAll();
    }
    else {
      this.errorFlag = true;
    }


  }
  checkConn = async (): Promise<boolean> => {



    try {
      if (await this._api.postRequest('test-conn', {
        'hostname': this.settingForm?.get('hostnameControl')?.value,
        'community': this.settingForm?.get('community')?.value,
        'oid': '.1.3.6.1.2.1.1.5.0',
        'version': this.settingForm?.get('choiceControl')?.value,
        'remote_port': this.settingForm?.get('portControl')?.value,
        'security_username': this.settingForm?.get('usernameControl')?.value,
        'auth_password': this.settingForm?.get('passwordControl')?.value,
        'privacy_password': this.settingForm?.get('privacy_password')?.value,
        'security_level': this.settingForm?.get('security_levelControl')?.value,
        'auth_protocol': this.settingForm?.get('auth_protocolControl')?.value,
        'privacy_protocol':this.settingForm?.get('privacy_protocolControl')?.value
      }).toPromise() != null) {
        return true
      }
      else {
        return false;
      }
    }
    catch {
      return false;
    }
  }



}