import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: false
})
export class LandingPage implements OnInit {

  constructor( private router: Router,) { }

  ngOnInit() {
  }

  irALogin() {
    this.router.navigate(['/login']); // ✅ Redirige a la página de login
  }

}
