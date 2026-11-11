import catalog from './catalog.json' with {type:'json'};
import {createRuntime} from './billing-runtime-factory.ts';
export const billing=createRuntime(catalog,'sandbox');
