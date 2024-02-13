import {Component, OnInit} from '@angular/core';
import {ListComponent} from "../list/list.component";
import {ContentService} from "../../libs/services/content-service/content.service";
import {DetailComponent} from "../detail/detail.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {AuthService} from "../../libs/services/auth-service/auth.service";
import {UnauthorizedComponent} from "../unauthorized/unauthorized.component";
import {ActivatedRoute, Router} from "@angular/router";
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ListComponent,
    DetailComponent,
    NgIf,
    UnauthorizedComponent,
    AsyncPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(public readonly contentService: ContentService,
              public readonly authService: AuthService) {}
}
