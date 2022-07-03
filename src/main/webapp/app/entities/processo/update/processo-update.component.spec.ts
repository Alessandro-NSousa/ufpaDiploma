import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProcessoService } from '../service/processo.service';
import { IProcesso, Processo } from '../processo.model';
import { ITurma } from 'app/entities/turma/turma.model';
import { TurmaService } from 'app/entities/turma/service/turma.service';
import { IEntregaDiploma } from 'app/entities/entrega-diploma/entrega-diploma.model';
import { EntregaDiplomaService } from 'app/entities/entrega-diploma/service/entrega-diploma.service';

import { ProcessoUpdateComponent } from './processo-update.component';

describe('Processo Management Update Component', () => {
  let comp: ProcessoUpdateComponent;
  let fixture: ComponentFixture<ProcessoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let processoService: ProcessoService;
  let turmaService: TurmaService;
  let entregaDiplomaService: EntregaDiplomaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProcessoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ProcessoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProcessoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    processoService = TestBed.inject(ProcessoService);
    turmaService = TestBed.inject(TurmaService);
    entregaDiplomaService = TestBed.inject(EntregaDiplomaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Turma query and add missing value', () => {
      const processo: IProcesso = { id: 456 };
      const turma: ITurma = { id: 48560 };
      processo.turma = turma;

      const turmaCollection: ITurma[] = [{ id: 55503 }];
      jest.spyOn(turmaService, 'query').mockReturnValue(of(new HttpResponse({ body: turmaCollection })));
      const additionalTurmas = [turma];
      const expectedCollection: ITurma[] = [...additionalTurmas, ...turmaCollection];
      jest.spyOn(turmaService, 'addTurmaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ processo });
      comp.ngOnInit();

      expect(turmaService.query).toHaveBeenCalled();
      expect(turmaService.addTurmaToCollectionIfMissing).toHaveBeenCalledWith(turmaCollection, ...additionalTurmas);
      expect(comp.turmasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call EntregaDiploma query and add missing value', () => {
      const processo: IProcesso = { id: 456 };
      const entregaDiploma: IEntregaDiploma = { id: 17204 };
      processo.entregaDiploma = entregaDiploma;

      const entregaDiplomaCollection: IEntregaDiploma[] = [{ id: 57939 }];
      jest.spyOn(entregaDiplomaService, 'query').mockReturnValue(of(new HttpResponse({ body: entregaDiplomaCollection })));
      const additionalEntregaDiplomas = [entregaDiploma];
      const expectedCollection: IEntregaDiploma[] = [...additionalEntregaDiplomas, ...entregaDiplomaCollection];
      jest.spyOn(entregaDiplomaService, 'addEntregaDiplomaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ processo });
      comp.ngOnInit();

      expect(entregaDiplomaService.query).toHaveBeenCalled();
      expect(entregaDiplomaService.addEntregaDiplomaToCollectionIfMissing).toHaveBeenCalledWith(
        entregaDiplomaCollection,
        ...additionalEntregaDiplomas
      );
      expect(comp.entregaDiplomasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const processo: IProcesso = { id: 456 };
      const turma: ITurma = { id: 45553 };
      processo.turma = turma;
      const entregaDiploma: IEntregaDiploma = { id: 53150 };
      processo.entregaDiploma = entregaDiploma;

      activatedRoute.data = of({ processo });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(processo));
      expect(comp.turmasSharedCollection).toContain(turma);
      expect(comp.entregaDiplomasSharedCollection).toContain(entregaDiploma);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Processo>>();
      const processo = { id: 123 };
      jest.spyOn(processoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ processo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: processo }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(processoService.update).toHaveBeenCalledWith(processo);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Processo>>();
      const processo = new Processo();
      jest.spyOn(processoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ processo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: processo }));
      saveSubject.complete();

      // THEN
      expect(processoService.create).toHaveBeenCalledWith(processo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Processo>>();
      const processo = { id: 123 };
      jest.spyOn(processoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ processo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(processoService.update).toHaveBeenCalledWith(processo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTurmaById', () => {
      it('Should return tracked Turma primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTurmaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEntregaDiplomaById', () => {
      it('Should return tracked EntregaDiploma primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEntregaDiplomaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
