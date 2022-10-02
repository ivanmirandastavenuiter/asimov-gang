import { AfterViewChecked, AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AsimovInputComponent } from './asimov-input/asimov-input.component';
import { SharedFormData } from './asimov-input/interfaces/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'asimov-gang';

  sharedFormData!: SharedFormData;

  ngAfterViewInit() {
  }

  setSharedFormData(sharedFormData: SharedFormData) {
    this.sharedFormData = sharedFormData;
    console.log(this.sharedFormData);
  }
}
