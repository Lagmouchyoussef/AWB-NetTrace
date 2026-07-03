import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROLE_LABELS, ROLE_SLUGS, Role } from '../core/types/role';

@Component({
  selector: 'app-role-select',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './role-select.component.html',
  styleUrl: './role-select.component.css',
})
export class RoleSelectComponent {
  protected readonly roles = Object.keys(ROLE_SLUGS) as Role[];
  protected readonly labels = ROLE_LABELS;
  protected readonly slugs = ROLE_SLUGS;
}
