import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EntregaDiplomaService } from '../service/entrega-diploma.service';

import { EntregaDiplomaComponent } from './entrega-diploma.component';

describe('EntregaDiploma Management Component', () => {
  let comp: EntregaDiplomaComponent;
  let fixture: ComponentFixture<EntregaDiplomaComponent>;
  let service: EntregaDiplomaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EntregaDiplomaComponent],
    })
      .overrideTemplate(EntregaDiplomaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EntregaDiplomaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EntregaDiplomaService);

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
    expect(comp.entregaDiplomas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
