import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITurma, getTurmaIdentifier } from '../turma.model';

export type EntityResponseType = HttpResponse<ITurma>;
export type EntityArrayResponseType = HttpResponse<ITurma[]>;

@Injectable({ providedIn: 'root' })
export class TurmaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/turmas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(turma: ITurma): Observable<EntityResponseType> {
    return this.http.post<ITurma>(this.resourceUrl, turma, { observe: 'response' });
  }

  update(turma: ITurma): Observable<EntityResponseType> {
    return this.http.put<ITurma>(`${this.resourceUrl}/${getTurmaIdentifier(turma) as number}`, turma, { observe: 'response' });
  }

  partialUpdate(turma: ITurma): Observable<EntityResponseType> {
    return this.http.patch<ITurma>(`${this.resourceUrl}/${getTurmaIdentifier(turma) as number}`, turma, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITurma>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITurma[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTurmaToCollectionIfMissing(turmaCollection: ITurma[], ...turmasToCheck: (ITurma | null | undefined)[]): ITurma[] {
    const turmas: ITurma[] = turmasToCheck.filter(isPresent);
    if (turmas.length > 0) {
      const turmaCollectionIdentifiers = turmaCollection.map(turmaItem => getTurmaIdentifier(turmaItem)!);
      const turmasToAdd = turmas.filter(turmaItem => {
        const turmaIdentifier = getTurmaIdentifier(turmaItem);
        if (turmaIdentifier == null || turmaCollectionIdentifiers.includes(turmaIdentifier)) {
          return false;
        }
        turmaCollectionIdentifiers.push(turmaIdentifier);
        return true;
      });
      return [...turmasToAdd, ...turmaCollection];
    }
    return turmaCollection;
  }
}
