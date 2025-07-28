import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router"

const normalizeValuesToArray = (value?: string | string[]): string[] => {
  return Array.isArray(value) ? value : (value ? [value] : []); 
}

interface useQueryParamsProps<T extends readonly string[]>{
  schema?: T,
  defaultInit?:
    | URLSearchParams
    | ({ type?: 'object' } & Partial<Record<T[number], string | string[]>>);
  options?: { defaultReplace?: boolean }
}

export const useQueryParams = <const T extends readonly string[]>({
  defaultInit,
  options,
}: useQueryParamsProps<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultInitRef = useRef(defaultInit ?? searchParams);
  const defaultReplaceRef = useRef(options?.defaultReplace ?? true);

  useEffect(() => {
    setSearchParams(defaultInitRef.current, {
      replace: defaultReplaceRef.current,
    });
  }, []);

  const setParam = (
    key: T[number], 
    value?: string | string[],
    options?: { replace?: boolean },
  ) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    
    const arrayValues = normalizeValuesToArray(value);
    
    for (const v of arrayValues) {
      params.append(key, v);
    }

    setSearchParams(params, { replace: options?.replace ?? defaultReplaceRef.current });
  }

  const replaceParams = (
    newParams?: URLSearchParams | Record<T[number], string | string[]>,
    options?: { replace?: boolean },
  ) => {
    setSearchParams(newParams, { replace: options?.replace ?? defaultReplaceRef.current });
  }

  return { 
    params: searchParams,
    setParam,
    replaceParams,
  };
}
