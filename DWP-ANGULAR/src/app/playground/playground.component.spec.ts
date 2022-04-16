import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ConfigService } from '../services/config.service';

import { PlaygroundComponent } from './playground.component';

describe('PortalComponent', () => {
  let component: PlaygroundComponent;
  let fixture: ComponentFixture<PlaygroundComponent>;
  let askService: ConfigService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaygroundComponent ],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            fetchUsersList: jasmine.createSpy('fetchUsersList').and.returnValue(of([])),
            getUserDetailsByID: jasmine.createSpy('getUserDetailsByID').and.returnValue(of([])),
            resolveQuery: jasmine
                  .createSpy('resolveQuery')
                  .and.returnValue(of([])),
          },
      },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaygroundComponent);
    component = fixture.componentInstance;
    askService = TestBed.inject(ConfigService);

    fixture.detectChanges();
  });

  it('should create Component and it a SAMPLE jasmine illustrates a concept of SPY', () => {
    expect(component).toBeTruthy();
  });

  describe('when initialized', () => {

    it('should call fetchUsersList #ConfigService', () => {
      expect(askService.fetchUsersList).toHaveBeenCalled();
    });

    it('should NOT call resolveQuery #ConfigService', () => {
      expect(askService.resolveQuery).not.toHaveBeenCalled();
    });
  });
});
