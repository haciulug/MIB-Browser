import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Box1Component, } from './box1/box1.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTreeModule} from '@angular/material/tree';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { Box2Component } from './box2/box2.component';
import { Box3Component } from './box3/box3.component';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import { SettingWindowComponent } from './dialog/setting-window/setting-window.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { InfoWindowComponent } from './dialog/info-window/info-window.component';
import { TrapDialogComponent } from './dialog/trap-dialog/trap-dialog.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageDirective } from './page.directive';




@NgModule({
  declarations: [
    AppComponent,
    Box1Component,
    Box2Component,
    Box3Component,
    SettingWindowComponent,
    InfoWindowComponent,
    TrapDialogComponent,
    PageDirective,
    
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }