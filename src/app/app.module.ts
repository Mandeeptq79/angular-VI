import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ScrollingModule,
    MatTableModule,
    TableVirtualScrollModule,
  ],
  declarations: [AppComponent, HelloComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
