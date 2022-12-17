import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  NgZone,
} from '@angular/core';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { filter, map, pairwise, throttleTime } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent {
  @ViewChild(CdkVirtualScrollViewport) scroller: CdkVirtualScrollViewport;
  listItems = [];
  constructor(private ngZone: NgZone) {}
  displayedColumns = ['id', 'name'];
  ngOnInit() {
    this.fetchMore();
  }
  ngAfterViewInit() {
    this.scroller
      .elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 140),
        throttleTime(200)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.fetchMore();
        });
      });
  }
  fetchMore(): void {
    const newItems = [];
    for (let i = 1; i < 20; i++) {
      newItems.push({
        id: i,
        name: `Element #${i}`,
      });
    }
    /* const DATA = Array.from({ length: 20 }, (v, i) => ({
      id: i + 1,
      name: `Element #${i + 1}`,
    })); */
    this.listItems = [...this.listItems, ...newItems];
  }
  //dataSource = new TableVirtualScrollDataSource(this.listItems);
}
