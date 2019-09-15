export interface Page {
  create(): void
  update(): void
}

export interface HTMLComponent {
  private element: HTMLElement
  public getElement(): HTMLElement
}

export interface FavItem {
  public favItemize(): { resource: string; href: string; innerText: string }
}
