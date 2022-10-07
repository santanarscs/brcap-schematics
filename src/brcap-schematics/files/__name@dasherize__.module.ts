import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { <%= classify(name) %>RoutingModule } from './<%= dasherize(name) %>-routing.module';
import { <%= classify(name) %>ListComponent } from './containers/<%= dasherize(name) %>-list/<%= dasherize(name) %>-list.component';
import { <%= classify(name) %>TableComponent } from './components/<%= dasherize(name) %>-table/<%= dasherize(name) %>-table.component';


@NgModule({
  declarations: [
    <%= classify(name) %>ListComponent,
    <%= classify(name) %>TableComponent
  ],
  imports: [
    CommonModule,
    <%= classify(name) %>RoutingModule
  ]
})
export class <%= classify(name) %>Module { }
