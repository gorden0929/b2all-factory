import { Subject } from 'rxjs';
import { EDivConfigType } from '../enums/div-config-type.enum';

export interface IDivConfigForButton {
  content: IDivButtonConfig | IDivButtonConfig[];
  type: EDivConfigType.Button;
}

interface IDivButtonConfig {
  text: string;
  onclick_fn: () => Promise<void> | null;
  onclick?: string;
  class: string;
  disabled: boolean;
  custom_option: { [key: string]: any };
  subscription?: Subject<boolean>;
}
