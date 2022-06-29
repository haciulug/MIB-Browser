import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, interval, takeWhile, retry } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { GlobalService } from 'src/app/service/global.service';
import { trap } from 'src/app/_models/trap';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


export interface TrapModel {
  position: number,
  port: number,
  oid: any,
  data: any
}

@Component({
  selector: 'app-trap-dialog',
  templateUrl: './trap-dialog.component.html',
  styleUrls: ['./trap-dialog.component.css']
})
export class TrapDialogComponent implements OnInit {
  trapForm!: FormGroup;
  clicked = false;
  trapArr: any[] = [];
  ELEMENT_DATA: TrapModel[] = [

  ];
  pageEvent: PageEvent;
  pageSize = 10;
  pageIndex: number = 0;
  displayedColumns: string[] = ['index', 'port', 'oid', 'data'];
  counter = 1;
  a: number = 0;
  b: number = 0;
  dataSource: any;
  length = 0;
  test() {
    console.log(this.trapForm.value as trap);
    console.log(GlobalService.trap);



  }
  constructor(private formBuilder: FormBuilder, private _api: ApiService) { }
  ngOnDestroy(): void {
    this.clicked = false;
    
  }
  @ViewChild('mat-paginator') paginator!: MatPaginator;
  ngAfterViewInit(): void {

/*     this.getData({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      previousPageIndex: 0,
      length:0} as PageEvent)
 */

      this.pageEvent = {pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        previousPageIndex: 0,
        length:0};
    // this.paginator.page.pipe()

  }
  ngOnInit(): void {
    this.trapForm = this.formBuilder.group({
      v1trap: [true],
      v3trap: [true],
      trapPort: [162, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
    });
    MatPaginator

  }




  getData(event: PageEvent) {
    console.log(event);




    this._api.postRequest('get-trap', event = event).subscribe(response => {

      this.dataSource = new MatTableDataSource<Element>(Object.values(response)[4])
      this.length = Object.values(response)[0]
      /*  this.dataSource = response.data;
       this.pageIndex = response.pageIndex;
       this.pageSize = response.pageSize;
       this.length = response.length; */

    })
    return event;
  }
  async startListen() {


    this._api.postRequest('get-trap', this.pageEvent).subscribe(response => {

      this.dataSource = new MatTableDataSource<Element>(Object.values(response)[4])
      this.length = Object.values(response)[0]
      /*  this.dataSource = response.data;
      this.pageIndex = response.pageIndex;
      this.pageSize = response.pageSize;
      this.length = response.length; */

    })


    /*  var cache = undefined;
     this._api.postRequest('get-trap',event ).subscribe(res => {
       cache = Object.values(res);
       
       
       for (let index = 0; index < Object.keys(res).length; index++) {
         const _cacheData = {position:this.counter, port:this.trapForm.get('trapPort')?.value, oid:Object.keys(res)[index], data:Object.values(res)[index]}
         this.ELEMENT_DATA = [...(!!this.ELEMENT_DATA && this.ELEMENT_DATA),_cacheData]
         this.counter++;

       }
     }) */  /* .subscribe(
    res => {
      
      
        for (let index = 0; index < Object.keys(res).length; index++) {
          this.trapArr.set(Object.keys(res)[index],Object.values(res)[index]) 
          
        }
    }
    
    
  ) */





  }
  async recieveTraps() {
    this.clicked = true;
    GlobalService.trap = this.trapForm.value as trap;
    this._api.postRequest('start-socket', GlobalService.trap).subscribe(res => {
      console.log(res);

    });
    interval(1000).pipe(takeWhile(res => res === null || this.clicked))
      .subscribe((x => {
        this.getData(this.pageEvent);

      }));
  }
  closeConn(){
    this._api.getRequest('close-socket').subscribe(res =>
      {
        console.log(res);
        
      });
  }





}


