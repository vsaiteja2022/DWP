import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundComponent } from './playground.component';
import { RouterModule } from '@angular/router';
import { portalRoutes } from './playground.routes';
import { PanelModule } from 'primeng/panel';
import { ConfigService } from '../services/config.service';
import { DataViewModule } from 'primeng/dataview';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [PlaygroundComponent, NotFoundComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(portalRoutes),
    PanelModule,
    DataViewModule,
    DropdownModule,
    ButtonModule,
  ],
  providers: [ConfigService],
  exports: [NotFoundComponent]
})
export class PlaygroundModule {}
