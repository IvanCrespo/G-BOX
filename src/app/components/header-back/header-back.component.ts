import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-back',
  templateUrl: './header-back.component.html',
  styleUrls: ['./header-back.component.scss'],
})
export class HeaderBackComponent implements OnInit {
  @Input() title: string;
  @Input() redirectTo: string;

  constructor() { }

  ngOnInit() {}
}