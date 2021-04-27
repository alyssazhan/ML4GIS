import { DeepMap, LiteralUnion } from './utils';
import { FieldValues, InternalFieldName, Ref } from './fields';
import { Message } from './form';
import { ValidateResult, RegisterOptions } from './validator';
export declare type MultipleFieldErrors = {
    [K in keyof RegisterOptions]?: ValidateResult;
} & {
    [key: string]: ValidateResult;
};
export declare type FieldError = {
    type: LiteralUnion<keyof RegisterOptions, string>;
    ref?: Ref;
    types?: MultipleFieldErrors;
    message?: Message;
};
export declare type ErrorOption = {
    types: MultipleFieldErrors;
    shouldFocus?: boolean;
} | {
    message?: Message;
    type?: LiteralUnion<keyof RegisterOptions, string>;
    shouldFocus?: boolean;
};
export declare type FieldErrors<TFieldValues extends FieldValues = FieldValues> = DeepMap<TFieldValues, FieldError>;
export declare type InternalFieldErrors<TFieldValues extends FieldValues> = Partial<Record<InternalFieldName<TFieldValues>, FieldError>>;
