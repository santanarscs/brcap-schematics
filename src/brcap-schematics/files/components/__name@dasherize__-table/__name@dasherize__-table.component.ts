import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-<%= dasherize(name) %>-table',
  templateUrl: './<%= dasherize(name) %>-table.component.html',
  styleUrls: ['./<%= dasherize(name) %>-table.component.scss']
})
export class <%= classify(name) %>TableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
