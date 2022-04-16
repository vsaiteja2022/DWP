import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

/**
 * This helps us to recover from bad URL route matches
 *
 * @memberof NotFoundComponent
 */
refresh() {
    window.location.href = 'http://localhost:4300/playground';
  }
}
