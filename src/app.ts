// Project Type
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public titulo: string,
    public descricao: string,
    public pessoas: number,
    public status: ProjectStatus
  ) {}
}

// Projeto State Management
type Listener = (items: Project[]) => void; // Tipo de funcao esperado nos listeners

class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  // Para garantir somente uma instancia da classe.
  private constructor() {}
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(titulo: string, descricao: string, numDePessoas: number) {
    const newProjeto = new Project(
      Math.random().toString(),
      titulo,
      descricao,
      numDePessoas,
      ProjectStatus.Active
    );

    this.projects.push(newProjeto);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); // Para evitar bugs e passado uma copia do array
    }
  }
}

// Estado Global
const projetoState = ProjectState.getInstance();

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
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    // Busca elemento com o template do formulario
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;

    // Div onde a aplicação será executada.
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = [];
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

    // Adiciona o listener para observar a lista de projetos, será executado em runtime quando listener for chamado.
    projetoState.addListener((projects: Project[]) => {
      // Inicializa lista de projetos com a lista de projetos do estado.
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attach();
    this.renderContent();
  }

  renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    for (const projectItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = projectItem.titulo;
      listEl.appendChild(listItem);
    }
  }

  /**
   * Metodo que acessa e renderiza dados da lista.
   */
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
      projetoState.addProject(titulo, desc, pessoas); // Adiciona o projeto no estado global
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
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
