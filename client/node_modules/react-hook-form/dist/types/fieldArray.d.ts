import { Control, UnpackNestedValue } from './form';
import { FieldValues } from './fields';
import { DeepPartial } from './utils';
export declare type FieldArrayName = string;
export declare type FieldArrayDefaultValues = Partial<Record<FieldArrayName, any>>;
export declare type UseFieldArrayOptions<TKeyName extends string = 'id', TControl extends Control = Control> = {
    name: FieldArrayName;
    keyName?: TKeyName;
    control?: TControl;
};
export declare type ResetFieldArrayFunctionRef<TFieldValues> = Record<FieldArrayName, (data?: UnpackNestedValue<DeepPartial<TFieldValues>>) => void>;
export declare type ArrayField<TFieldArrayValues extends FieldValues = FieldValues, TKeyName extends string = 'id'> = TFieldArrayValues & Record<TKeyName, string>;
export declare type UseFieldArrayMethods<TFieldArrayValues extends FieldValues = FieldValues, TKeyName extends string = 'id'> = {
    swap: (indexA: number, indexB: number) => void;
    move: (indexA: number, indexB: number) => void;
    prepend: (value: Partial<TFieldArrayValues> | Partial<TFieldArrayValues>[], shouldFocus?: boolean) => void;
    append: (value: Partial<TFieldArrayValues> | Partial<TFieldArrayValues>[], shouldFocus?: boolean) => void;
    remove: (index?: number | number[]) => void;
    insert: (index: number, value: Partial<TFieldArrayValues> | Partial<TFieldArrayValues>[], shouldFocus?: boolean) => void;
    fields: Partial<ArrayField<TFieldArrayValues, TKeyName>>[];
};
