import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IEntregaDiploma, EntregaDiploma } from '../entrega-diploma.model';

import { EntregaDiplomaService } from './entrega-diploma.service';

describe('EntregaDiploma Service', () => {
  let service: EntregaDiplomaService;
  let httpMock: HttpTestingController;
  let elemDefault: IEntregaDiploma;
  let expectedResult: IEntregaDiploma | IEntregaDiploma[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EntregaDiplomaService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      dataDeEntrega: currentDate,
      observacoes: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dataDeEntrega: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a EntregaDiploma', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dataDeEntrega: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dataDeEntrega: currentDate,
        },
        returnedFromService
      );

      service.create(new EntregaDiploma()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EntregaDiploma', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dataDeEntrega: currentDate.format(DATE_FORMAT),
          observacoes: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dataDeEntrega: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EntregaDiploma', () => {
      const patchObject = Object.assign(
        {
          observacoes: 'BBBBBB',
        },
        new EntregaDiploma()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dataDeEntrega: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EntregaDiploma', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dataDeEntrega: currentDate.format(DATE_FORMAT),
          observacoes: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dataDeEntrega: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a EntregaDiploma', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEntregaDiplomaToCollectionIfMissing', () => {
      it('should add a EntregaDiploma to an empty array', () => {
        const entregaDiploma: IEntregaDiploma = { id: 123 };
        expectedResult = service.addEntregaDiplomaToCollectionIfMissing([], entregaDiploma);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(entregaDiploma);
      });

      it('should not add a EntregaDiploma to an array that contains it', () => {
        const entregaDiploma: IEntregaDiploma = { id: 123 };
        const entregaDiplomaCollection: IEntregaDiploma[] = [
          {
            ...entregaDiploma,
          },
          { id: 456 },
        ];
        expectedResult = service.addEntregaDiplomaToCollectionIfMissing(entregaDiplomaCollection, entregaDiploma);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EntregaDiploma to an array that doesn't contain it", () => {
        const entregaDiploma: IEntregaDiploma = { id: 123 };
        const entregaDiplomaCollection: IEntregaDiploma[] = [{ id: 456 }];
        expectedResult = service.addEntregaDiplomaToCollectionIfMissing(entregaDiplomaCollection, entregaDiploma);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(entregaDiploma);
      });

      it('should add only unique EntregaDiploma to an array', () => {
        const entregaDiplomaArray: IEntregaDiploma[] = [{ id: 123 }, { id: 456 }, { id: 94348 }];
        const entregaDiplomaCollection: IEntregaDiploma[] = [{ id: 123 }];
        expectedResult = service.addEntregaDiplomaToCollectionIfMissing(entregaDiplomaCollection, ...entregaDiplomaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const entregaDiploma: IEntregaDiploma = { id: 123 };
        const entregaDiploma2: IEntregaDiploma = { id: 456 };
        expectedResult = service.addEntregaDiplomaToCollectionIfMissing([], entregaDiploma, entregaDiploma2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(entregaDiploma);
        expect(expectedResult).toContain(entregaDiploma2);
      });

      it('should accept null and undefined values', () => {
        const entregaDiploma: IEntregaDiploma = { id: 123 };
        expectedResult = service.addEntregaDiplomaToCollectionIfMissing([], null, entregaDiploma, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(entregaDiploma);
      });

      it('should return initial array if no EntregaDiploma is added', () => {
        const entregaDiplomaCollection: IEntregaDiploma[] = [{ id: 123 }];
        expectedResult = service.addEntregaDiplomaToCollectionIfMissing(entregaDiplomaCollection, undefined, null);
        expect(expectedResult).toEqual(entregaDiplomaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
