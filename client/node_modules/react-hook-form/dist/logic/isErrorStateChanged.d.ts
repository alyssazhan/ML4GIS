import { InternalFieldName, FieldErrors, FieldNamesMarkedBoolean, FieldError } from '../types';
declare const _default: <TFieldValues extends Record<string, any>>({ errors, name, error, validFields, fieldsWithValidation, }: {
    errors: import("../types").DeepMap<TFieldValues, FieldError>;
    error: FieldError | undefined;
    name: InternalFieldName<TFieldValues>;
    validFields: import("../types").DeepMap<TFieldValues, true>;
    fieldsWithValidation: import("../types").DeepMap<TFieldValues, true>;
}) => boolean;
export default _default;
