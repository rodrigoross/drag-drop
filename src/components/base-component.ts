/**
 * Componente Base de Projetos
 *
 * Usa Generics visto que o host e element pode ser qqer tipo de elemento dom
 */
export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
