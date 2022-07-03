export interface ITurma {
  id?: number;
  curso?: string | null;
  ano?: string | null;
}

export class Turma implements ITurma {
  constructor(public id?: number, public curso?: string | null, public ano?: string | null) {}
}

export function getTurmaIdentifier(turma: ITurma): number | undefined {
  return turma.id;
}
