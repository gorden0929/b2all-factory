import { EventEmitter } from '@angular/core';
import { IDivConfig } from './div-config.interface';

export interface IDiv {
  config: IDivConfig;
  index: number;
  formSubmitEvent?: EventEmitter<any>;
  formChangeEvent?: EventEmitter<any>;
  buttonSubmitEvent?: EventEmitter<any>;
}
