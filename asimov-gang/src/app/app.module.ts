import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AsimovInputComponent } from './asimov-input/asimov-input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { AsimovGridComponent } from './asimov-grid/asimov-grid.component';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AsimovInputComponent,
    AsimovGridComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers: [FormGroupDirective],
  bootstrap: [AppComponent]
})
export class AppModule { }
