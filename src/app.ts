/**
 * OOP
 */
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;

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

    // renderiza o conteudo.
    this.attach();
  }

  /**
   * Método responsável por adicionar conteuod do DOM no HTML.
   */
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
  }
}

const projetoInput = new ProjectInput();