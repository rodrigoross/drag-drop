import Component from "./base-component.js";
import { Project } from "../models/project.js";
import { Autobind } from "../decorators/autobind.js";
import { Draggable } from "../models/drag-drop.js";

/**
 * Project Item
 */
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
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

  @Autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.projeto.id); // Transfere somente o ID para poder recuper posteriormente
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_: DragEvent) {}

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.projeto.titulo;
    this.element.querySelector("h3")!.textContent =
      this.pessoas + " no projeto";
    this.element.querySelector("p")!.textContent = this.projeto.descricao;
  }
}
