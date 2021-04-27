import { FieldValues, UseControllerOptions, UseControllerMethods } from './types';
export declare function useController<TFieldValues extends FieldValues = FieldValues>({ name, rules, defaultValue, control, onFocus, }: UseControllerOptions<TFieldValues>): UseControllerMethods<TFieldValues>;
