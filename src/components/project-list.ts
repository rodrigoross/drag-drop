import Component from "./base-component";
import { ProjectItem } from "./project-item";
import { Project, ProjectStatus } from "../models/project";
import { Autobind } from "../decorators/autobind";
import { DragTarget } from "../models/drag-drop";
import { projetoState } from "../state/project-state";

/**
 * Project List
 */
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  @Autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault(); // Por padrao drag e drop e desabilitado no JS.
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @Autobind
  dropHandler(event: DragEvent) {
    const projId = event.dataTransfer!.getData("text/plain");

    projetoState.moveProject(
      projId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @Autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

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
