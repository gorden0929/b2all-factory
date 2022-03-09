import { EDivConfigType } from '../enums/div-config-type.enum';
import { IFieldConfig } from './field-config.interface';

export interface IDivConfigForForm {
    content: IDivFormConfig;
    type: EDivConfigType.Form;
}

interface IDivFormConfig {
    form_unique_name: string; // for used when data return identity;
    form_design: IFieldConfig[];
    saved_data: { [key: string]: any };
}
