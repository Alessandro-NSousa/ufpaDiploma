import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProcesso, getProcessoIdentifier } from '../processo.model';

export type EntityResponseType = HttpResponse<IProcesso>;
export type EntityArrayResponseType = HttpResponse<IProcesso[]>;

@Injectable({ providedIn: 'root' })
export class ProcessoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/processos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(processo: IProcesso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(processo);
    return this.http
      .post<IProcesso>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(processo: IProcesso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(processo);
    return this.http
      .put<IProcesso>(`${this.resourceUrl}/${getProcessoIdentifier(processo) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(processo: IProcesso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(processo);
    return this.http
      .patch<IProcesso>(`${this.resourceUrl}/${getProcessoIdentifier(processo) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProcesso>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProcesso[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProcessoToCollectionIfMissing(processoCollection: IProcesso[], ...processosToCheck: (IProcesso | null | undefined)[]): IProcesso[] {
    const processos: IProcesso[] = processosToCheck.filter(isPresent);
    if (processos.length > 0) {
      const processoCollectionIdentifiers = processoCollection.map(processoItem => getProcessoIdentifier(processoItem)!);
      const processosToAdd = processos.filter(processoItem => {
        const processoIdentifier = getProcessoIdentifier(processoItem);
        if (processoIdentifier == null || processoCollectionIdentifiers.includes(processoIdentifier)) {
          return false;
        }
        processoCollectionIdentifiers.push(processoIdentifier);
        return true;
      });
      return [...processosToAdd, ...processoCollection];
    }
    return processoCollection;
  }

  protected convertDateFromClient(processo: IProcesso): IProcesso {
    return Object.assign({}, processo, {
      data: processo.data?.isValid() ? processo.data.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.data = res.body.data ? dayjs(res.body.data) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((processo: IProcesso) => {
        processo.data = processo.data ? dayjs(processo.data) : undefined;
      });
    }
    return res;
  }
}
