/**
 * Autobind Decorator,  como método decorator
 */
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
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

/**
 * Regras de validação
 */
// Objecto de validacao padrao
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// funcao que valida
function validate(input: Validatable) {
  let isValid = true;
  if (input.required) {
    isValid = isValid && input.value.toString().trim().length !== 0;
  }

  if (input.minLength != null && typeof input.value === "string") {
    isValid = isValid && input.value.toString().trim().length > input.minLength;
  }

  if (input.maxLength != null && typeof input.value === "string") {
    isValid = isValid && input.value.toString().trim().length > input.maxLength;
  }

  if (input.min != null && typeof input.value === "number") {
    isValid = isValid && input.value >= input.min;
  }

  if (input.max != null && typeof input.value === "number") {
    isValid = isValid && input.value <= input.max;
  }

  return isValid;
}

/**
 * Classes
 */

/**
 * Project List
 */
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;

  constructor(private type: "active" | "finished") {
    // Busca elemento com o template do formulario
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;

    // Div onde a aplicação será executada.
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    /**
     * Carrega o conteudo do template para renderizar no DOM.
     */
    const importContent = document.importNode(
      this.templateElement.content,
      true
    );

    // Pega o primeiro elemento (form) e salva na váriavel
    this.element = importContent.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`; // adiciona ID para aplicar CSS e identificar
    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId; //acessa e seta a tag html
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  /**
   * Método responsável por adicionar conteuod do DOM no HTML.
   */
  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

/**
 *  Project Input
 */
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;

  /**
   * Propriedades com acesso aos inputs do formulário.
   */
  tituloInput: HTMLInputElement;
  descricaoInput: HTMLInputElement;
  pessoasInput: HTMLInputElement;

  /**
   * Inicializa e carrega os elementos HTML em memória para as propriedades.
   */
  constructor() {
    // Busca elemento com o template do formulario
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;

    // Div onde a aplicação será executada.
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    /**
     * Carrega o conteudo do template para renderizar no DOM.
     */
    const importContent = document.importNode(
      this.templateElement.content,
      true
    );

    // Pega o primeiro elemento (form) e salva na váriavel
    this.formElement = importContent.firstElementChild as HTMLFormElement;
    this.formElement.id = "user-input"; // adiciona ID para aplicar CSS

    // Pega acesso aos inputs.
    this.tituloInput = this.formElement.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descricaoInput = this.formElement.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.pessoasInput = this.formElement.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure(); // Adiciona eventListener no formulário

    // renderiza o conteudo.
    this.attach();
  }

  /**
   * Método responsável por adicionar conteuod do DOM no HTML.
   */
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
  }

  /**
   * Método responsável por adicionar listener no submit do formulario.
   */
  private configure() {
    // this.formElement.addEventListener('submit', this.handleSubmit); // This. que será executado no evento não se refere a classe instanciada.
    // this.formElement.addEventListener('submit', this.handleSubmit.bind(this)); // Agora é repassado o mesmo this, executado no método configure (class ProjectInput) para o metodo do submit
    this.formElement.addEventListener("submit", this.handleSubmit);
  }

  private loadUserInput(): [string, string, number] | void {
    const titulo = this.tituloInput.value;
    const descricao = this.descricaoInput.value;
    const pessoas = this.pessoasInput.value;

    const tituloValidate: Validatable = {
      value: titulo,
      required: true,
    };

    const descricaoValidate: Validatable = {
      value: descricao,
      required: true,
      minLength: 5,
    };

    const pessoasValidate: Validatable = {
      value: +pessoas,
      required: true,
      min: 1,
      max: 5,
    };

    // validação simples
    if (
      !validate(tituloValidate) ||
      !validate(descricaoValidate) ||
      !validate(pessoasValidate)
    ) {
      alert("Valores invalidos, tente novamente!");
      return;
    }

    return [titulo, descricao, +pessoas];
  }

  /**
   * Método responsável por executar a lógica de submit.
   * @param event
   */
  @Autobind
  private handleSubmit(event: Event) {
    event.preventDefault();

    const entradaUsuario = this.loadUserInput(); // Carrega valores de entrada no formulário

    // verifica se veio os valores de tupla
    if (Array.isArray(entradaUsuario)) {
      const [titulo, desc, pessoas] = entradaUsuario; // remove valores do array

      console.log(titulo, desc, pessoas);
    }

    this.limpaFormulario();
  }

  /**
   * Limpa campos do formulario de projetos.
   */
  private limpaFormulario() {
    this.tituloInput.value = "";
    this.descricaoInput.value = "";
    this.pessoasInput.value = "";
  }
}

const projetoInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
