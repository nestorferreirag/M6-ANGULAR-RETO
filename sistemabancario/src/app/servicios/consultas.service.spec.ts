import { TestBed } from '@angular/core/testing';

import { ConsultasService } from './consultas.service';

describe('ConsultasaldoService', () => {
  let service: ConsultasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
