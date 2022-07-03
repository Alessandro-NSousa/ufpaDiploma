import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEntregaDiploma, getEntregaDiplomaIdentifier } from '../entrega-diploma.model';

export type EntityResponseType = HttpResponse<IEntregaDiploma>;
export type EntityArrayResponseType = HttpResponse<IEntregaDiploma[]>;

@Injectable({ providedIn: 'root' })
export class EntregaDiplomaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/entrega-diplomas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(entregaDiploma: IEntregaDiploma): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entregaDiploma);
    return this.http
      .post<IEntregaDiploma>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(entregaDiploma: IEntregaDiploma): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entregaDiploma);
    return this.http
      .put<IEntregaDiploma>(`${this.resourceUrl}/${getEntregaDiplomaIdentifier(entregaDiploma) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(entregaDiploma: IEntregaDiploma): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entregaDiploma);
    return this.http
      .patch<IEntregaDiploma>(`${this.resourceUrl}/${getEntregaDiplomaIdentifier(entregaDiploma) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEntregaDiploma>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEntregaDiploma[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEntregaDiplomaToCollectionIfMissing(
    entregaDiplomaCollection: IEntregaDiploma[],
    ...entregaDiplomasToCheck: (IEntregaDiploma | null | undefined)[]
  ): IEntregaDiploma[] {
    const entregaDiplomas: IEntregaDiploma[] = entregaDiplomasToCheck.filter(isPresent);
    if (entregaDiplomas.length > 0) {
      const entregaDiplomaCollectionIdentifiers = entregaDiplomaCollection.map(
        entregaDiplomaItem => getEntregaDiplomaIdentifier(entregaDiplomaItem)!
      );
      const entregaDiplomasToAdd = entregaDiplomas.filter(entregaDiplomaItem => {
        const entregaDiplomaIdentifier = getEntregaDiplomaIdentifier(entregaDiplomaItem);
        if (entregaDiplomaIdentifier == null || entregaDiplomaCollectionIdentifiers.includes(entregaDiplomaIdentifier)) {
          return false;
        }
        entregaDiplomaCollectionIdentifiers.push(entregaDiplomaIdentifier);
        return true;
      });
      return [...entregaDiplomasToAdd, ...entregaDiplomaCollection];
    }
    return entregaDiplomaCollection;
  }

  protected convertDateFromClient(entregaDiploma: IEntregaDiploma): IEntregaDiploma {
    return Object.assign({}, entregaDiploma, {
      dataDeEntrega: entregaDiploma.dataDeEntrega?.isValid() ? entregaDiploma.dataDeEntrega.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dataDeEntrega = res.body.dataDeEntrega ? dayjs(res.body.dataDeEntrega) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((entregaDiploma: IEntregaDiploma) => {
        entregaDiploma.dataDeEntrega = entregaDiploma.dataDeEntrega ? dayjs(entregaDiploma.dataDeEntrega) : undefined;
      });
    }
    return res;
  }
}
