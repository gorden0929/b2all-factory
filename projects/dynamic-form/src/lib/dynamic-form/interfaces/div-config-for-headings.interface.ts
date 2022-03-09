import { EDivConfigType } from '../enums/div-config-type.enum';

export interface IDivConfigForHeadings {
    content: IDivHeadingsConfig;
    type: EDivConfigType.Headings;
}

export interface IDivHeadingsConfig {
    text: string;
    class: string;
}
