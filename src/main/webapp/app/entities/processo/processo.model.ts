import dayjs from 'dayjs/esm';
import { ITurma } from 'app/entities/turma/turma.model';
import { IEntregaDiploma } from 'app/entities/entrega-diploma/entrega-diploma.model';
import { StatusProcesso } from 'app/entities/enumerations/status-processo.model';
import { Status } from 'app/entities/enumerations/status.model';
import { Enviado } from 'app/entities/enumerations/enviado.model';

export interface IProcesso {
  id?: number;
  statusProcesso?: StatusProcesso | null;
  matricula?: string;
  nome?: string | null;
  data?: dayjs.Dayjs | null;
  numeroDaDefesa?: string | null;
  statusSigaa?: Status | null;
  numeroSipac?: string | null;
  enviadoBiblioteca?: Enviado | null;
  turma?: ITurma | null;
  entregaDiploma?: IEntregaDiploma | null;
}

export class Processo implements IProcesso {
  constructor(
    public id?: number,
    public statusProcesso?: StatusProcesso | null,
    public matricula?: string,
    public nome?: string | null,
    public data?: dayjs.Dayjs | null,
    public numeroDaDefesa?: string | null,
    public statusSigaa?: Status | null,
    public numeroSipac?: string | null,
    public enviadoBiblioteca?: Enviado | null,
    public turma?: ITurma | null,
    public entregaDiploma?: IEntregaDiploma | null
  ) {}
}

export function getProcessoIdentifier(processo: IProcesso): number | undefined {
  return processo.id;
}
