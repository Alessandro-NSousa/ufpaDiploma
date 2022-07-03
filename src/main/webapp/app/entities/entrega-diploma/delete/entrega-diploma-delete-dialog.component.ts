import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEntregaDiploma } from '../entrega-diploma.model';
import { EntregaDiplomaService } from '../service/entrega-diploma.service';

@Component({
  templateUrl: './entrega-diploma-delete-dialog.component.html',
})
export class EntregaDiplomaDeleteDialogComponent {
  entregaDiploma?: IEntregaDiploma;

  constructor(protected entregaDiplomaService: EntregaDiplomaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.entregaDiplomaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
