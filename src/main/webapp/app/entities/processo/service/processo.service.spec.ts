import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { StatusProcesso } from 'app/entities/enumerations/status-processo.model';
import { Status } from 'app/entities/enumerations/status.model';
import { Enviado } from 'app/entities/enumerations/enviado.model';
import { IProcesso, Processo } from '../processo.model';

import { ProcessoService } from './processo.service';

describe('Processo Service', () => {
  let service: ProcessoService;
  let httpMock: HttpTestingController;
  let elemDefault: IProcesso;
  let expectedResult: IProcesso | IProcesso[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProcessoService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      statusProcesso: StatusProcesso.PENDENTE,
      matricula: 'AAAAAAA',
      nome: 'AAAAAAA',
      data: currentDate,
      numeroDaDefesa: 'AAAAAAA',
      statusSigaa: Status.ATIVO,
      numeroSipac: 'AAAAAAA',
      enviadoBiblioteca: Enviado.SIM,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          data: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Processo', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          data: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          data: currentDate,
        },
        returnedFromService
      );

      service.create(new Processo()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Processo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          statusProcesso: 'BBBBBB',
          matricula: 'BBBBBB',
          nome: 'BBBBBB',
          data: currentDate.format(DATE_FORMAT),
          numeroDaDefesa: 'BBBBBB',
          statusSigaa: 'BBBBBB',
          numeroSipac: 'BBBBBB',
          enviadoBiblioteca: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          data: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Processo', () => {
      const patchObject = Object.assign(
        {
          statusProcesso: 'BBBBBB',
          nome: 'BBBBBB',
          data: currentDate.format(DATE_FORMAT),
          numeroDaDefesa: 'BBBBBB',
          enviadoBiblioteca: 'BBBBBB',
        },
        new Processo()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          data: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Processo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          statusProcesso: 'BBBBBB',
          matricula: 'BBBBBB',
          nome: 'BBBBBB',
          data: currentDate.format(DATE_FORMAT),
          numeroDaDefesa: 'BBBBBB',
          statusSigaa: 'BBBBBB',
          numeroSipac: 'BBBBBB',
          enviadoBiblioteca: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          data: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Processo', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProcessoToCollectionIfMissing', () => {
      it('should add a Processo to an empty array', () => {
        const processo: IProcesso = { id: 123 };
        expectedResult = service.addProcessoToCollectionIfMissing([], processo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(processo);
      });

      it('should not add a Processo to an array that contains it', () => {
        const processo: IProcesso = { id: 123 };
        const processoCollection: IProcesso[] = [
          {
            ...processo,
          },
          { id: 456 },
        ];
        expectedResult = service.addProcessoToCollectionIfMissing(processoCollection, processo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Processo to an array that doesn't contain it", () => {
        const processo: IProcesso = { id: 123 };
        const processoCollection: IProcesso[] = [{ id: 456 }];
        expectedResult = service.addProcessoToCollectionIfMissing(processoCollection, processo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(processo);
      });

      it('should add only unique Processo to an array', () => {
        const processoArray: IProcesso[] = [{ id: 123 }, { id: 456 }, { id: 77642 }];
        const processoCollection: IProcesso[] = [{ id: 123 }];
        expectedResult = service.addProcessoToCollectionIfMissing(processoCollection, ...processoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const processo: IProcesso = { id: 123 };
        const processo2: IProcesso = { id: 456 };
        expectedResult = service.addProcessoToCollectionIfMissing([], processo, processo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(processo);
        expect(expectedResult).toContain(processo2);
      });

      it('should accept null and undefined values', () => {
        const processo: IProcesso = { id: 123 };
        expectedResult = service.addProcessoToCollectionIfMissing([], null, processo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(processo);
      });

      it('should return initial array if no Processo is added', () => {
        const processoCollection: IProcesso[] = [{ id: 123 }];
        expectedResult = service.addProcessoToCollectionIfMissing(processoCollection, undefined, null);
        expect(expectedResult).toEqual(processoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
