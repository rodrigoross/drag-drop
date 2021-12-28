/**
 * Autobind Decorator,  como método decorator
 */
namespace App {
  export function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value; // acessa o método original
    // Cria um novo descritor para passar para o método
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      enumerable: false,
      get() {
        const boundFn = originalMethod.bind(this); // Dessa forma o this é feito o bind automatico.
        return boundFn;
      },
    };
    return adjDescriptor;
  }
}
