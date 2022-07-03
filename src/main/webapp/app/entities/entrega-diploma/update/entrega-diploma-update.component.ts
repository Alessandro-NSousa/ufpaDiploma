import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEntregaDiploma, EntregaDiploma } from '../entrega-diploma.model';
import { EntregaDiplomaService } from '../service/entrega-diploma.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-entrega-diploma-update',
  templateUrl: './entrega-diploma-update.component.html',
})
export class EntregaDiplomaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    dataDeEntrega: [],
    observacoes: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected entregaDiplomaService: EntregaDiplomaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ entregaDiploma }) => {
      this.updateForm(entregaDiploma);
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('diplomaApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const entregaDiploma = this.createFromForm();
    if (entregaDiploma.id !== undefined) {
      this.subscribeToSaveResponse(this.entregaDiplomaService.update(entregaDiploma));
    } else {
      this.subscribeToSaveResponse(this.entregaDiplomaService.create(entregaDiploma));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEntregaDiploma>>): void {
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

  protected updateForm(entregaDiploma: IEntregaDiploma): void {
    this.editForm.patchValue({
      id: entregaDiploma.id,
      dataDeEntrega: entregaDiploma.dataDeEntrega,
      observacoes: entregaDiploma.observacoes,
    });
  }

  protected createFromForm(): IEntregaDiploma {
    return {
      ...new EntregaDiploma(),
      id: this.editForm.get(['id'])!.value,
      dataDeEntrega: this.editForm.get(['dataDeEntrega'])!.value,
      observacoes: this.editForm.get(['observacoes'])!.value,
    };
  }
}
