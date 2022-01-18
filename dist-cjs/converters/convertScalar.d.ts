import { DMMF } from '@prisma/generator-helper';
import type { Config } from '../generateGraphqlSchema';
declare const convertScalar: (initialField: DMMF.Field, model: DMMF.Model, config?: Config | undefined, isModelsOfSchema?: boolean) => DMMF.Field;
export default convertScalar;
