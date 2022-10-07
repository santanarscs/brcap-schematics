import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-<%= dasherize(name) %>-list',
  templateUrl: './<%= dasherize(name) %>-list.component.html',
  styleUrls: ['./<%= dasherize(name) %>-list.component.scss']
})
export class <%= classify(name) %>ListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
