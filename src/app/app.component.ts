import {
  VIRTUAL_SCROLL_STRATEGY,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  NgZone,
  Inject,
} from '@angular/core';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import {
  Observable,
  of,
  combineLatest,
  filter,
  map,
  pairwise,
  throttleTime,
} from 'rxjs';
import { TableVirtualScrollStrategy } from './virtualscrollstrategy.service';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useClass: TableVirtualScrollStrategy,
    },
  ],
})
export class AppComponent implements OnInit {
  // Manually set the amount of buffer and the height of the table elements
  static BUFFER_SIZE = 3;
  rowHeight = 48;
  headerHeight = 56;
  @ViewChild(CdkVirtualScrollViewport) scroller: CdkVirtualScrollViewport;
  dataSource: Observable<Array<any>>;
  gridHeight = 400;
  listItems = [];
  rows: Observable<Array<any>>;

  displayedColumns = ['id', 'name'];
  constructor(
    private ngZone: NgZone,
    @Inject(VIRTUAL_SCROLL_STRATEGY)
    private readonly scrollStrategy: TableVirtualScrollStrategy
  ) {}

  ngOnInit() {
    //this.rows = of(this.listItems);
    const range =
      Math.ceil(this.gridHeight / this.rowHeight) + AppComponent.BUFFER_SIZE;
    this.scrollStrategy.setScrollHeight(this.rowHeight, this.headerHeight);
    this.fetchMore();
    console.log(this.listItems);
    this.rows = of(this.listItems);
    console.log(this.rows);
    this.dataSource = combineLatest([
      this.rows,
      this.scrollStrategy.scrolledIndexChange,
    ]).pipe(
      map((value: any) => {
        // Determine the start and end rendered range
        const start = Math.max(0, value[1] - AppComponent.BUFFER_SIZE);
        const end = Math.min(value[0].length, value[1] + range);

        // Update the datasource for the rendered range of data
        return value[0].slice(start, end);
      })
    );
    console.log(this.dataSource);
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
