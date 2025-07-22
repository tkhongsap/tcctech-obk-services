type LogConfig = {
  logPrivateMethods?: boolean;
};

export function logWrapper<T extends Object>(
  obj: T,
  config: LogConfig = {},
): T {
  return new Proxy(obj, {
    get(target, prop: keyof T, receiver) {
      const original = Reflect.get(target, prop, receiver);

      // Don't wrap private methods if not configured to
      if (!config.logPrivateMethods && String(prop).startsWith('_')) {
        return original;
      }

      if (typeof original === 'function') {
        return function (...args: any[]) {
          const formatArgument = (arg: any) => {
            if (typeof arg === 'object' && arg !== null) {
              return JSON.stringify(arg, null, '\t');
            }
            return arg;
          };

          const inputArgs = args.map(formatArgument);
          console.debug(
            `[${target.constructor.name}][${String(prop)}] - input`,
            inputArgs,
          );

          const result = original.apply(this, args);
          if (result instanceof Promise) {
            result.then((res: any) => {
              console.debug(
                `[${target.constructor.name}][${String(prop)}] - output`,
                formatArgument(res),
              );
            });
          } else {
            console.debug(
              `[${target.constructor.name}][${String(prop)}] - output`,
              formatArgument(result),
            );
          }
          return result;
        };
      }
      return original;
    },
  });
}
