export enum ProjectStatus {
  Active,
  Finished,
}

export class Project {
  constructor(
    public id: string,
    public titulo: string,
    public descricao: string,
    public pessoas: number,
    public status: ProjectStatus
  ) {}
}
