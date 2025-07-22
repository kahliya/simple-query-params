import { useEffect } from "react";
import { useSearchParams } from "react-router"

const normalizeValuesToArray = (value?: string | string[]): string[] => {
  return Array.isArray(value) ? value : (value ? [value] : []); 
}

interface useQueryParamsProps<T extends readonly string[]>{
  schema?: T,
  defaultInit?: URLSearchParams | Record<T[number], string | string[]>,
  options?: { defaultReplace?: boolean }
}

export const useQueryParams = <const T extends readonly string[]>({
  defaultInit,
  options,
}: useQueryParamsProps<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultReplace = options?.defaultReplace ?? true;

  useEffect(() => {
    setSearchParams(defaultInit, { replace: defaultReplace });
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

    setSearchParams(params, { replace: options?.replace ?? defaultReplace });
  }

  const replaceParams = (
    newParams?: URLSearchParams | Record<T[number], string | string[]>,
    options?: { replace?: boolean },
  ) => {
    setSearchParams(newParams, { replace: options?.replace ?? defaultReplace });
  }

  return { 
    params: searchParams,
    setParam,
    replaceParams,
  };
}
