import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { getValidators } from '../../classes/custom-validator.class';
import { EFieldConfigInputType } from '../../enums/field-config-input-type.enum';
import { EFieldConfigType } from '../../enums/field-config-type.enum';
import { EFormValidator } from '../../enums/form-validator.enum';
import { IFieldConfigForArrayConfig } from '../../interfaces/field-config-for-array.interface';
import { IFieldConfigForButtonConfig } from '../../interfaces/field-config-for-button.interface';
import { IFieldConfigForInputConfig } from '../../interfaces/field-config-for-input.interface';
import { IFieldConfig } from '../../interfaces/field-config.interface';
import { IMultiSelect } from '../../interfaces/multi-select.interface';
import { DynamicFormComponent } from '../dynamic-form.component';

@Component({
  selector: 'b2all-multiselect-dataset',
  templateUrl: './multiselect-dataset.component.html',
  styleUrls: ['./multiselect-dataset.component.css']
})
export class MultiselectDatasetComponent implements OnInit, AfterViewInit {

  @ViewChild(DynamicFormComponent) dynamicForm!: DynamicFormComponent;

  @Input() inputHierarchyLevels!: string[];
  @Input() inputData!: { [key: string]: any };
  @Input() inputSubmitButtonTemplate!: IFieldConfig<IFieldConfigForButtonConfig>;
  @Output() outputFormOnSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() outputFormOnChange: EventEmitter<any> = new EventEmitter<any>();

  multiSelectTemplate: IFieldConfig<any>[] = [];
  formReady = false;

  constructor() { }

  ngAfterViewInit(): void {
    this.dynamicForm.changes.subscribe(resp => {
      this.outputFormOnChange.emit(resp);
    });
  }

  ngOnInit(): void {

    // generate the multiselect template based on the level received
    const theTemplate = this.generateTemplate(this.inputHierarchyLevels);
    // push the template into the fields stack
    this.multiSelectTemplate.push(theTemplate);
    this.multiSelectTemplate.push(this.inputSubmitButtonTemplate);
    // set the form state to ready so the dynamic form will start rendering
    this.formReady = true;

  }

  formOnSubmitting(val: any): void {
    this.outputFormOnSubmit.emit(this.recursiveSort(val));
  }

  generateTemplate(values: string[]): any {
    let lvlTemplate: any;
    for (let i = values.length - 1; i >= 0; i--) {
      if (i === (values.length - 1)) {
        lvlTemplate = this.generateTemplateForLastLevel(values[i], values.length - 1, i, ['Key', 'Value']);
      } else {
        lvlTemplate = this.genearteTemplateForLevelHasChildren(values[i], lvlTemplate, values.length - 1, i, ['Key', 'Value', 'Children']);
      }
    }
    return lvlTemplate;
  }

  generateTemplateForLastLevel(displayText: string, maxIndex: number, curIndex: number, columnNames: string[]): any {
    return {
      name: 'children',
      display_text: displayText,
      type: EFieldConfigType.Array,
      type_config: {
        hierarchy_level: {
          cur_level: curIndex, max_level: maxIndex,
        },
        table_column_names: columnNames,
        field_configs: [
          {
            name: 'key',
            type: EFieldConfigType.Input,
            validation_fn: getValidators([{ type: EFormValidator.Required }]),
            type_config: {
              type: EFieldConfigInputType.Text,
              list: false,
              css_class: { group: '', group_label: '', input: 'form-control form-control-sm', input_label: '' }
            },
            css_class: 'key-width-non-child'
          },
          {
            name: 'value',
            type: EFieldConfigType.Input,
            validation_fn: getValidators([{ type: EFormValidator.Required }]),
            type_config: {
              type: EFieldConfigInputType.Text,
              list: false,
              css_class: { group: '', group_label: '', input: 'form-control form-control-sm', input_label: '' }
            },
            css_class: 'val-width-non-child'
          },
        ],
        css_class: {
          add_button: 'btn btn-sm btn-primary',
          del_button: 'btn btn-sm btn-danger',
          group: '',
          group_label: '',
          label: ''
        }
      },
    };
  }

  genearteTemplateForLevelHasChildren(
    displayText: string, theNextLevelTemplate: any,
    maxIndex: number, curIndex: number, columnNames: string[]): any {

    return {
      name: 'children',
      display_text: displayText,
      type: EFieldConfigType.Array,
      type_config: {
        hierarchy_level: {
          cur_level: curIndex, max_level: maxIndex,
        },
        table_column_names: columnNames,
        field_configs: [
          {
            name: 'key',
            type: EFieldConfigType.Input,
            validation_fn: getValidators([{ type: EFormValidator.Required }]),
            type_config: {
              type: EFieldConfigInputType.Text,
              list: false,
              css_class: { group: '', group_label: '', input: 'form-control form-control-sm', input_label: '' }
            },
            css_class: 'key-width-has-child'
          },
          {
            name: 'value',
            type: EFieldConfigType.Input,
            validation_fn: getValidators([{ type: EFormValidator.Required }]),
            type_config: {
              type: EFieldConfigInputType.Text,
              list: false,
              css_class: { group: '', group_label: '', input: 'form-control form-control-sm', input_label: '' }
            },
            css_class: 'val-width-has-child'
          },
          {
            ...theNextLevelTemplate
          }
        ],
        css_class: {
          add_button: 'btn btn-sm btn-primary',
          del_button: 'btn btn-sm btn-danger',
          group: '',
          group_label: '',
          label: ''
        }
      },
    };
  }

  recursiveSort(value: IMultiSelect): IMultiSelect {
    if (value && value.children) {
      const sortedObject: IMultiSelect = { key: value.key, value: value.value, children: this.arrayOfObjectSort(value.children) };
      const newChildren: IMultiSelect[] = [];
      sortedObject.children?.forEach(element => {
        newChildren.push(this.recursiveSort(element));
      });
      return { key: value.key, value: value.value, children: newChildren };
    } else {
      return value;
    }
  }

  arrayOfObjectSort(oriArray: IMultiSelect[]): IMultiSelect[] {
    return oriArray.sort((obj1: IMultiSelect, obje2: IMultiSelect) => {
      if (obj1.key > obje2.key) {
        return 1;
      }
      if (obj1.key < obje2.key) {
        return -1;
      }
      return 0;
    });
  }

}
