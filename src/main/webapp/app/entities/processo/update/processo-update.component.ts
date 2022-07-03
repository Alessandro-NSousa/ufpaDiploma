import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProcesso, Processo } from '../processo.model';
import { ProcessoService } from '../service/processo.service';
import { ITurma } from 'app/entities/turma/turma.model';
import { TurmaService } from 'app/entities/turma/service/turma.service';
import { IEntregaDiploma } from 'app/entities/entrega-diploma/entrega-diploma.model';
import { EntregaDiplomaService } from 'app/entities/entrega-diploma/service/entrega-diploma.service';
import { StatusProcesso } from 'app/entities/enumerations/status-processo.model';
import { Status } from 'app/entities/enumerations/status.model';
import { Enviado } from 'app/entities/enumerations/enviado.model';

@Component({
  selector: 'jhi-processo-update',
  templateUrl: './processo-update.component.html',
})
export class ProcessoUpdateComponent implements OnInit {
  isSaving = false;
  statusProcessoValues = Object.keys(StatusProcesso);
  statusValues = Object.keys(Status);
  enviadoValues = Object.keys(Enviado);

  turmasSharedCollection: ITurma[] = [];
  entregaDiplomasSharedCollection: IEntregaDiploma[] = [];

  editForm = this.fb.group({
    id: [],
    statusProcesso: [],
    matricula: [null, [Validators.required]],
    nome: [],
    data: [],
    numeroDaDefesa: [],
    statusSigaa: [],
    numeroSipac: [],
    enviadoBiblioteca: [],
    turma: [],
    entregaDiploma: [],
  });

  constructor(
    protected processoService: ProcessoService,
    protected turmaService: TurmaService,
    protected entregaDiplomaService: EntregaDiplomaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ processo }) => {
      this.updateForm(processo);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const processo = this.createFromForm();
    if (processo.id !== undefined) {
      this.subscribeToSaveResponse(this.processoService.update(processo));
    } else {
      this.subscribeToSaveResponse(this.processoService.create(processo));
    }
  }

  trackTurmaById(_index: number, item: ITurma): number {
    return item.id!;
  }

  trackEntregaDiplomaById(_index: number, item: IEntregaDiploma): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProcesso>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(processo: IProcesso): void {
    this.editForm.patchValue({
      id: processo.id,
      statusProcesso: processo.statusProcesso,
      matricula: processo.matricula,
      nome: processo.nome,
      data: processo.data,
      numeroDaDefesa: processo.numeroDaDefesa,
      statusSigaa: processo.statusSigaa,
      numeroSipac: processo.numeroSipac,
      enviadoBiblioteca: processo.enviadoBiblioteca,
      turma: processo.turma,
      entregaDiploma: processo.entregaDiploma,
    });

    this.turmasSharedCollection = this.turmaService.addTurmaToCollectionIfMissing(this.turmasSharedCollection, processo.turma);
    this.entregaDiplomasSharedCollection = this.entregaDiplomaService.addEntregaDiplomaToCollectionIfMissing(
      this.entregaDiplomasSharedCollection,
      processo.entregaDiploma
    );
  }

  protected loadRelationshipsOptions(): void {
    this.turmaService
      .query()
      .pipe(map((res: HttpResponse<ITurma[]>) => res.body ?? []))
      .pipe(map((turmas: ITurma[]) => this.turmaService.addTurmaToCollectionIfMissing(turmas, this.editForm.get('turma')!.value)))
      .subscribe((turmas: ITurma[]) => (this.turmasSharedCollection = turmas));

    this.entregaDiplomaService
      .query()
      .pipe(map((res: HttpResponse<IEntregaDiploma[]>) => res.body ?? []))
      .pipe(
        map((entregaDiplomas: IEntregaDiploma[]) =>
          this.entregaDiplomaService.addEntregaDiplomaToCollectionIfMissing(entregaDiplomas, this.editForm.get('entregaDiploma')!.value)
        )
      )
      .subscribe((entregaDiplomas: IEntregaDiploma[]) => (this.entregaDiplomasSharedCollection = entregaDiplomas));
  }

  protected createFromForm(): IProcesso {
    return {
      ...new Processo(),
      id: this.editForm.get(['id'])!.value,
      statusProcesso: this.editForm.get(['statusProcesso'])!.value,
      matricula: this.editForm.get(['matricula'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      data: this.editForm.get(['data'])!.value,
      numeroDaDefesa: this.editForm.get(['numeroDaDefesa'])!.value,
      statusSigaa: this.editForm.get(['statusSigaa'])!.value,
      numeroSipac: this.editForm.get(['numeroSipac'])!.value,
      enviadoBiblioteca: this.editForm.get(['enviadoBiblioteca'])!.value,
      turma: this.editForm.get(['turma'])!.value,
      entregaDiploma: this.editForm.get(['entregaDiploma'])!.value,
    };
  }
}
