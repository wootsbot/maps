/**
 * deprecatedClass: creates a subclass of the class, which prints deprecated warning when called
 */
export function deprecatedClass<C extends new (...args: any[]) => object>(
  origClass: C,
  deprecationMessage: string,
): C {
  const result = class extends origClass {
    constructor(...args: any[]) {
      console.log(`Deprecated: ${deprecationMessage}`);
      super(...args);
    }
  };
  return result;
}

/**
 * Copy properties from origObject to newObject, which not exists in newObject,
 * calls onDeprecatedCalled callback in case a copied property is invoked.
 */
export function copyPropertiesAsDeprecated(
  origObject: { [key: string]: unknown },
  newObject: { [key: string]: unknown },
  onDeprecatedCalled: (key: string) => void,
  accessors: { [key: string]: (value: unknown) => unknown } = {},
): { [key: string]: unknown } {
  const result = newObject;
  for (const [key, value] of Object.entries(origObject)) {
    if (!newObject[key]) {
      Object.defineProperty(result, key, {
        get() {
          onDeprecatedCalled(key);
          return accessors[key] ? accessors[key](value) : value;
        },
      });
    }
  }
  return result;
}
