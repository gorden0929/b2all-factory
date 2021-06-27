import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IFieldConfigForInputConfig } from '../../interfaces/field-config-for-input.interface';
import { IFieldConfig } from '../../interfaces/field-config.interface';
import { IField } from '../../interfaces/field.interface';

@Component({
  selector: 'b2all-dynamic-field-input',
  templateUrl: './dynamic-field-input.component.html',
  styleUrls: ['./dynamic-field-input.component.css']
})
export class DynamicFieldInputComponent implements OnInit, IField {

  config!: IFieldConfig;
  group!: FormGroup;
  index!: number;

  detailConfig!: IFieldConfigForInputConfig;

  constructor() { }

  ngOnInit(): void {
    this.detailConfig = (this.config.type_config as IFieldConfigForInputConfig);
  }

  onCheckChange(event: any): void {
    const fa: FormArray = this.group.get(this.config.name) as FormArray;

    if (event.target.checked) {
      console.log(`adding ${event.target.value}`);
      fa.push(new FormControl(event.target.value));
    } else {
      console.log(`removing ${event.target.value}`);

      let i = 0;

      for (const element of fa.controls) {
        if (element.value === event.target.value) {
          fa.removeAt(i);
          break;
        }
        i++;
      }

    }

  }

  shouldChecked(val: string): boolean {
    const fa: FormArray = this.group.get(this.config.name) as FormArray;

    let i = 0;
    for (const element of fa.controls) {
      if (element.value === val) {
        return true;
      }
      i++;
    }
    return false;
  }

}
