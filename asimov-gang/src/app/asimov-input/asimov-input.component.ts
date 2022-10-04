import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ValidationErrors, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { SharedFormData } from './interfaces/interfaces';

@Component({
  selector: 'app-asimov-input',
  templateUrl: './asimov-input.component.html',
  styleUrls: ['./asimov-input.component.scss']
})
export class AsimovInputComponent implements OnInit {

  public initForm!: FormGroup;
  public formWrapper!: FormGroup;

  @Output() sharedFormData = new EventEmitter<SharedFormData>();

  public isFormStarted: boolean = false;

  public robotControlKeys: string[] = [];

  public initFormErrors!: ValidationErrors;
  public gridSetupErrors: { key: string, errors: ValidationErrors }[] = [];

  public hasRobotFormAnyError: boolean = false;

  constructor(public parentForm: FormGroupDirective) { }

  /**
   * On init hook
   */
  ngOnInit(): void {
    this.setInitialForms();
  }

  /**
   * Sets initial forms
   */
  setInitialForms() {
    this.initForm = new FormGroup({
      numberOfRobots: new FormControl('', 
      [
        Validators.required, 
        Validators.max(10), 
        Validators.pattern("[0-9]{1,2}")
      ])
    });
    this.formWrapper = new FormGroup({
      gridSetupForm: new FormGroup({
        gridSetupXAxis: new FormControl('', 
        [
          Validators.required, 
          Validators.max(10), 
          Validators.pattern("[0-9]{1,2}")
        ]),
        gridSetupYAxis: new FormControl('',
        [
          Validators.required, 
          Validators.max(10), 
          Validators.pattern("[0-9]{1,2}")
        ])
      })
    });
  }

  /**
   * This is the form submit that contains all relevant data (second)
   * If everything is ok, then move forward. Otherwise, show errors
   * 
   * @param event 
   */
  onConfigFormSubmit(event: Event) {
    event.preventDefault();

    const gridControls = (this.formWrapper.get('gridSetupForm') as FormGroup).controls;
    let isAnyGridError = false;

    for (let gridControlKey of Object.keys(gridControls)) {
      let gridControl = gridControls[gridControlKey];
      if (gridControl.errors) {
        isAnyGridError = true;
        let key = gridControlKey.includes('Y') ? 'Y' :'X';
        this.gridSetupErrors.push({ key: key, errors: gridControl.errors })
      }
    }

    if (!isAnyGridError) {
      let gridSetupForm = {} as FormGroup;
      let currentRobotFormGroups = [];
      
      for (let formControlKey of Object.keys(this.formWrapper.controls)) {
        if (formControlKey === 'gridSetupForm') {
          gridSetupForm = this.formWrapper.controls[formControlKey] as FormGroup;
        } else {
          let currentControl = this.formWrapper.controls[formControlKey] as FormGroup;
          this.hasRobotFormAnyError = this.checkCurrentRobotFormGroupErrors(currentControl);
          currentControl.addControl('identifier', new FormControl(Guid.create().toString()));
          currentRobotFormGroups.push(currentControl);
        }
      }
      
      if (!this.hasRobotFormAnyError) {
        let sharedFormData = {
          gridSetupForm: gridSetupForm,
          robotsFormGroups: currentRobotFormGroups,
          numberOfRobots: currentRobotFormGroups.length
        };
    
        this.emitSharedFormData(sharedFormData);
      }
    }
  }

  /**
   * Init form. Checks number of robots and displays next forms
   * If everything ok, move forward. Otherwise show errors.
   * 
   * @param event 
   */
  onBootstrapFormSubmit(event: Event) {
    event.preventDefault();
    
    this.initFormErrors = (this.initForm.get('numberOfRobots') as FormGroup).errors as ValidationErrors;

    if (!this.initFormErrors) {
      this.isFormStarted = true;

      this.robotControlKeys = [];
  
      for (let i = 1; i <= this.initForm.value.numberOfRobots; i++) {
        let currentRobotFormGroup = new FormGroup({
          xAxis: new FormControl('', 
          [
            Validators.required, 
            Validators.max(10), 
            Validators.pattern("[0-9]{1,2}")
          ]),
          yAxis: new FormControl('',
          [
            Validators.required, 
            Validators.max(10), 
            Validators.pattern("[0-9]{1,2}")
          ]),
          orientation: new FormControl('',
          [
            Validators.required, 
            Validators.pattern("[NWES]{1}")
          ]),
          instructions: new FormControl('',
          [
            Validators.required, 
            Validators.pattern("[LRF]{1,10}")
          ]),
        });
        this.formWrapper.addControl(`currentRobotFormGroup${i}`, currentRobotFormGroup);
        this.robotControlKeys.push(`currentRobotFormGroup${i}`);
      }
    }
  }

  /**
   * Emits the data for the other component to have it
   * 
   * @param sharedFormData 
   */
  emitSharedFormData(sharedFormData: SharedFormData){
    this.sharedFormData.emit(sharedFormData);
  }

  /**
   * Method used to control errors at robot controls
   * 
   * @param robotControlKey 
   * @param control 
   * @returns 
   */
  checkErrors(robotControlKey: string, control: string) {
    let errorMessage = '';
    const currentControlGroup = this.formWrapper.get(robotControlKey);
    const currentControl = currentControlGroup?.get(control);

    if (currentControl?.errors) {
      const errorKeys = Object.keys(currentControl?.errors);
      errorKeys.forEach(ek => {
        switch (ek) {
          case 'pattern':
            errorMessage += `
              ${control} has invalid pattern
            `;
            break;
          case 'max':
            errorMessage += `
              ${control} exceed valid limit
            `;
            break;
          case 'required':
            errorMessage += `
              ${control} required
            `;
            break;
        }
      });
    }
    return errorMessage;
  }

  /**
   * Flag for controlling existence of errors in robot forms
   * 
   * @param robotFormGroup 
   * @returns 
   */
  checkCurrentRobotFormGroupErrors(robotFormGroup: FormGroup): boolean {
    return robotFormGroup.get('xAxis')?.errors != null ||
           robotFormGroup.get('yAxis')?.errors != null || 
           robotFormGroup.get('orientation')?.errors != null || 
           robotFormGroup.get('instructions')?.errors != null;
  }

  /**
   * Reset operations
   */
  resetForm() {
    this.initForm.reset();
    this.initFormErrors = {} as ValidationErrors;
    this.gridSetupErrors = [];
    const formKeys = Object.keys(this.formWrapper.controls);

    for (let key of formKeys) {
      this.formWrapper.get(key)?.reset();
    }

    this.setInitialForms();

    this.robotControlKeys = [];
    this.isFormStarted = false;
    this.hasRobotFormAnyError = false;
  }
}
