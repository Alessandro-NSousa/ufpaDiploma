import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EntregaDiplomaService } from '../service/entrega-diploma.service';
import { IEntregaDiploma, EntregaDiploma } from '../entrega-diploma.model';

import { EntregaDiplomaUpdateComponent } from './entrega-diploma-update.component';

describe('EntregaDiploma Management Update Component', () => {
  let comp: EntregaDiplomaUpdateComponent;
  let fixture: ComponentFixture<EntregaDiplomaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let entregaDiplomaService: EntregaDiplomaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EntregaDiplomaUpdateComponent],
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
      .overrideTemplate(EntregaDiplomaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EntregaDiplomaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    entregaDiplomaService = TestBed.inject(EntregaDiplomaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const entregaDiploma: IEntregaDiploma = { id: 456 };

      activatedRoute.data = of({ entregaDiploma });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(entregaDiploma));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EntregaDiploma>>();
      const entregaDiploma = { id: 123 };
      jest.spyOn(entregaDiplomaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entregaDiploma });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: entregaDiploma }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(entregaDiplomaService.update).toHaveBeenCalledWith(entregaDiploma);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EntregaDiploma>>();
      const entregaDiploma = new EntregaDiploma();
      jest.spyOn(entregaDiplomaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entregaDiploma });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: entregaDiploma }));
      saveSubject.complete();

      // THEN
      expect(entregaDiplomaService.create).toHaveBeenCalledWith(entregaDiploma);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EntregaDiploma>>();
      const entregaDiploma = { id: 123 };
      jest.spyOn(entregaDiplomaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ entregaDiploma });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(entregaDiplomaService.update).toHaveBeenCalledWith(entregaDiploma);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
