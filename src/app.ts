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
type Listener<T> = (items: T[]) => void; // Tipo de funcao esperado nos listeners

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  // Para garantir somente uma instancia da classe.
  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
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
 * Componente Base de Projetos
 *
 * Usa Generics visto que o host e element pode ser qqer tipo de elemento dom
 */
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T; // Onde o elemento será renderizado
  element: U; // Qual Elemento será renderizado

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    // Busca elemento com o template do formulario
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;

    // Div onde a aplicação será executada.
    this.hostElement = document.getElementById(hostElementId)! as T;

    //Carrega o conteudo do template para renderizar no DOM.
    const importContent = document.importNode(
      this.templateElement.content,
      true
    );

    // Pega o primeiro elemento (form) e salva na váriavel
    this.element = importContent.firstElementChild as U;
    if (newElementId) this.element.id = newElementId; // adiciona ID para aplicar CSS e identificar

    this.attach(insertAtStart);
  }

  /**
   * Método responsável por adicionar conteuod do DOM no HTML.
   */
  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

/**
 * Project Item
 */
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private projeto: Project;

  get pessoas() {
    if (this.projeto.pessoas === 1) {
      return "1 pessoa";
    } else {
      return `${this.projeto.pessoas} pessoas`;
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.projeto = project;

    this.configure();
    this.renderContent();
  }

  configure(): void {}

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.projeto.titulo;
    this.element.querySelector("h3")!.textContent =
      this.pessoas + " no projeto";
    this.element.querySelector("p")!.textContent = this.projeto.descricao;
  }
}

/**
 * Project List
 */
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  configure() {
    // Adiciona o listener para observar a lista de projetos, será executado em runtime quando listener for chamado.
    projetoState.addListener((projects: Project[]) => {
      // Filtra projetos pelo tipo.
      const projetosListados = projects.filter((projeto) => {
        if (this.type === "active")
          return projeto.status === ProjectStatus.Active;
        return projeto.status === ProjectStatus.Finished;
      });

      // Inicializa lista de projetos com a lista de projetos do estado.
      this.assignedProjects = projetosListados;
      this.renderProjects();
    });
  }

  /**
   * Metodo que acessa e renderiza dados da lista.
   */
  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId; //acessa e seta a tag html
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    listEl.innerHTML = ""; // Reseta valores anteriores da lista do projeto

    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
    }
  }
}

/**
 *  Project Input
 */
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
    super("project-input", "app", true, "user-input");
    // Pega acesso aos inputs.
    this.tituloInput = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descricaoInput = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.pessoasInput = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure(); // Adiciona eventListener no formulário
  }

  /**
   * Método responsável por adicionar listener no submit do formulario.
   */
  configure() {
    // this.formElement.addEventListener('submit', this.handleSubmit); // This. que será executado no evento não se refere a classe instanciada.
    // this.formElement.addEventListener('submit', this.handleSubmit.bind(this)); // Agora é repassado o mesmo this, executado no método configure (class ProjectInput) para o metodo do submit
    this.element.addEventListener("submit", this.handleSubmit);
  }

  renderContent(): void {}

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
