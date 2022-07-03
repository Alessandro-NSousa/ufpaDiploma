import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'processo',
        data: { pageTitle: 'diplomaApp.processo.home.title' },
        loadChildren: () => import('./processo/processo.module').then(m => m.ProcessoModule),
      },
      {
        path: 'turma',
        data: { pageTitle: 'diplomaApp.turma.home.title' },
        loadChildren: () => import('./turma/turma.module').then(m => m.TurmaModule),
      },
      {
        path: 'entrega-diploma',
        data: { pageTitle: 'diplomaApp.entregaDiploma.home.title' },
        loadChildren: () => import('./entrega-diploma/entrega-diploma.module').then(m => m.EntregaDiplomaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
