import { FormGroup } from "@angular/forms";

export interface SharedFormData {
    gridSetupForm: FormGroup;
    robotsFormGroups: FormGroup[];
    numberOfRobots: number;
}