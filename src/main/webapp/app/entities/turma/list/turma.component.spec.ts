import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TurmaService } from '../service/turma.service';

import { TurmaComponent } from './turma.component';

describe('Turma Management Component', () => {
  let comp: TurmaComponent;
  let fixture: ComponentFixture<TurmaComponent>;
  let service: TurmaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TurmaComponent],
    })
      .overrideTemplate(TurmaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TurmaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TurmaService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.turmas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
