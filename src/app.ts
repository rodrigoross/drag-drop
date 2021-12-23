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
 * OOP
 * Project Input Class
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
    this.tituloInput = this.formElement.querySelector('#title')! as HTMLInputElement;
    this.descricaoInput = this.formElement.querySelector('#description')! as HTMLInputElement;
    this.pessoasInput = this.formElement.querySelector('#people')! as HTMLInputElement;

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
    this.formElement.addEventListener("submit", this.handleSubmit)
  }

  /**
   * Método responsável por executar a lógica de submit.
   * @param event 
   */
  @Autobind
  private handleSubmit(event: Event) {
    event.preventDefault();

    console.log(this.tituloInput.value);
    
  }
}

const projetoInput = new ProjectInput();
