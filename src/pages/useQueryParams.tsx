import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router"

const normalizeValuesToArray = (value?: string | string[]): string[] => {
  return Array.isArray(value) ? value : (value ? [value] : []); 
}

interface useQueryParamsProps<T extends readonly string[]> {
  schema?: T;
  defaultInit?: URLSearchParams | Partial<Record<T[number], string | string[]>>;
  options?: { defaultReplace?: boolean };
}

export const useQueryParams = <const T extends readonly string[]>({
  schema,
  defaultInit,
  options,
}: useQueryParamsProps<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // useRef to ensure stable constants
  const schemaSetRef = useRef(new Set(schema));
  const defaultInitRef = useRef(defaultInit ?? searchParams);
  const defaultReplaceRef = useRef(options?.defaultReplace ?? true);

  useEffect(() => {
    setSearchParams(
      defaultInitRef.current as Record<string, string | string[]>,
      {
        replace: defaultReplaceRef.current,
      }
    );
  }, []);

  useEffect(() => {
    if (schemaSetRef.current.size === 0) return;

    const invalidKeys: string[] = [];
    for (const key of searchParams.keys()) {
      if (!schemaSetRef.current.has(key)) invalidKeys.push(key);
    }

    if (invalidKeys.length > 0) {
      console.warn(
        '[useQueryParams] Found unknown query key(s).',
        'If intentional, consider adding these keys to the schema',
        invalidKeys
      );
    }
  }, [searchParams]);

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
