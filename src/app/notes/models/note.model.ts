export class Note {
  constructor(
    public id: number | null,
    public name: string,
    public description: string,
    public isChecked: boolean
  ) {}
}
