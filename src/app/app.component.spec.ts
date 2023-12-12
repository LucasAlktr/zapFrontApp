import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { CreateDocComponent } from './create-doc/create-doc.component';
import { DocService } from './services/doc.service';
import { CoreService } from './core/core.service';
import { ConfirmationDialogComponent } from './events/ConfirmationDialogComponent';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let docServiceSpy: jasmine.SpyObj<DocService>;
  let coreServiceSpy: jasmine.SpyObj<CoreService>;

  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    docServiceSpy = jasmine.createSpyObj('DocService', ['listDocs', 'getDocDetail', 'updateDoc', 'deleteDoc']);
    coreServiceSpy = jasmine.createSpyObj('CoreService', ['openSnackBar']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: DocService, useValue: docServiceSpy },
        { provide: CoreService, useValue: coreServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });


  it('Deve-se chamar getDocList() em ngOnInit()', () => {
    spyOn(component, 'getDocList');
    component.ngOnInit();
    expect(component.getDocList).toHaveBeenCalled();
  });

  it('Deve-se chamar listDocs() e setar o dataSource em getDocList()', fakeAsync(() => {
    const mockDocs = [{ id: 1, name: 'Doc1' }, { id: 2, name: 'Doc2' }];
    docServiceSpy.listDocs.and.returnValue(of(mockDocs));

    component.getDocList();
    tick();

    expect(docServiceSpy.listDocs).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockDocs);
  }));

  it('Deve-se chamar openSnackBar e getDocList() em signedDoc()', fakeAsync(() => {
    const mockDocId = 1;
    const mockDoc = { id: mockDocId, signed: false };

    docServiceSpy.getDocDetail.and.returnValue(of(mockDoc));
    docServiceSpy.updateDoc.and.returnValue(of({}));

    component.signedDoc(mockDocId);
    tick();

    expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmationDialogComponent, jasmine.any(Object));
    expect(docServiceSpy.getDocDetail).toHaveBeenCalledWith(mockDocId);
    expect(docServiceSpy.updateDoc).toHaveBeenCalledWith(mockDocId, jasmine.any(Object));
    expect(coreServiceSpy.openSnackBar).toHaveBeenCalledWith('Document signed!', 'done');
    expect(component.getDocList).toHaveBeenCalled();
  }));

  it('Deve-se chamar openSnackBar e getDocList() em deleteDoc()', fakeAsync(() => {
    const mockDocId = 1;

    docServiceSpy.deleteDoc.and.returnValue(of({}));

    component.deleteDoc(mockDocId);
    tick();

    expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmationDialogComponent, jasmine.any(Object));
    expect(docServiceSpy.deleteDoc).toHaveBeenCalledWith(mockDocId);
    expect(coreServiceSpy.openSnackBar).toHaveBeenCalledWith('Documento deletedo!', 'done');
    expect(component.getDocList).toHaveBeenCalled();
  }));

  it('Deve-se abrir a caixa de diálogo CreateDocComponent com dados em openEditForm()', () => {
    const mockData = { id: 1, name: 'Doc1' };
    
    component.openEditForm(mockData);

    expect(dialogSpy.open).toHaveBeenCalledWith(CreateDocComponent, { data: mockData });
  });
});
