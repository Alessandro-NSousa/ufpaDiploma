import dayjs from 'dayjs/esm';

export interface IEntregaDiploma {
  id?: number;
  dataDeEntrega?: dayjs.Dayjs | null;
  observacoes?: string | null;
}

export class EntregaDiploma implements IEntregaDiploma {
  constructor(public id?: number, public dataDeEntrega?: dayjs.Dayjs | null, public observacoes?: string | null) {}
}

export function getEntregaDiplomaIdentifier(entregaDiploma: IEntregaDiploma): number | undefined {
  return entregaDiploma.id;
}
