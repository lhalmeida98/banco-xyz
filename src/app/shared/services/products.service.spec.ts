import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { environment } from '../../../environments/environment';
import { FinancialProduct } from '../../core/models/FinancialProduct';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  const apiUrlBank = environment.urlApiBank;
  const strBp = 'bp/';
  const strProducts = 'products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService]
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch products list', () => {
    const dummyProducts: FinancialProduct[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() },
      { id: '2', name: 'Product 2', description: 'Description 2', logo: 'logo2.png', date_release: new Date(), date_revision: new Date() }
    ];

    service.searchProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(`${apiUrlBank}${strBp}${strProducts}`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: dummyProducts });
  });

});
