/**
 * Regras de validação
 */
namespace App {
  // Objecto de validacao padrao
  export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }

  // funcao que valida
  export function validate(input: Validatable) {
    let isValid = true;
    if (input.required) {
      isValid = isValid && input.value.toString().trim().length !== 0;
    }

    if (input.minLength != null && typeof input.value === "string") {
      isValid =
        isValid && input.value.toString().trim().length > input.minLength;
    }

    if (input.maxLength != null && typeof input.value === "string") {
      isValid =
        isValid && input.value.toString().trim().length > input.maxLength;
    }

    if (input.min != null && typeof input.value === "number") {
      isValid = isValid && input.value >= input.min;
    }

    if (input.max != null && typeof input.value === "number") {
      isValid = isValid && input.value <= input.max;
    }

    return isValid;
  }
}
