import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEntregaDiploma } from '../entrega-diploma.model';
import { EntregaDiplomaService } from '../service/entrega-diploma.service';
import { EntregaDiplomaDeleteDialogComponent } from '../delete/entrega-diploma-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-entrega-diploma',
  templateUrl: './entrega-diploma.component.html',
})
export class EntregaDiplomaComponent implements OnInit {
  entregaDiplomas?: IEntregaDiploma[];
  isLoading = false;

  constructor(protected entregaDiplomaService: EntregaDiplomaService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.entregaDiplomaService.query().subscribe({
      next: (res: HttpResponse<IEntregaDiploma[]>) => {
        this.isLoading = false;
        this.entregaDiplomas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IEntregaDiploma): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(entregaDiploma: IEntregaDiploma): void {
    const modalRef = this.modalService.open(EntregaDiplomaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.entregaDiploma = entregaDiploma;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
