import { Component } from "../components/base-component.js";
import { Autobind } from "../decorators/autobind.js";
import { validate, Validatable } from "../util/validation.js";
import { projetoState } from "../state/project-state";
/**
 *  Project Input
 */
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
