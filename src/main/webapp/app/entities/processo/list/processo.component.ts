import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProcesso } from '../processo.model';
import { ProcessoService } from '../service/processo.service';
import { ProcessoDeleteDialogComponent } from '../delete/processo-delete-dialog.component';

@Component({
  selector: 'jhi-processo',
  templateUrl: './processo.component.html',
})
export class ProcessoComponent implements OnInit {
  processos?: IProcesso[];
  isLoading = false;

  constructor(protected processoService: ProcessoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.processoService.query().subscribe({
      next: (res: HttpResponse<IProcesso[]>) => {
        this.isLoading = false;
        this.processos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IProcesso): number {
    return item.id!;
  }

  delete(processo: IProcesso): void {
    const modalRef = this.modalService.open(ProcessoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.processo = processo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
