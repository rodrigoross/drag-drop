/**
 * Projeto State Management
 */
namespace App {
  type Listener<T> = (items: T[]) => void; // Tipo de funcao esperado nos listeners

  class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
      this.listeners.push(listenerFn);
    }
  }

  export class ProjectState extends State<Project> {
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
      this.updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
      const projeto = this.projects.find((project) => project.id === projectId);

      if (projeto && projeto.status !== newStatus) {
        projeto.status = newStatus;
        this.updateListeners();
      }
    }

    private updateListeners() {
      for (const listenerFn of this.listeners) {
        listenerFn(this.projects.slice()); // Para evitar bugs e passado uma copia do array
      }
    }
  }

  // Estado Global
  export const projetoState = ProjectState.getInstance();
}
