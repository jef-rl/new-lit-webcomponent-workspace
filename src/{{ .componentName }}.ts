import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('{{ .componentName }}')
export class {{ toPascal .componentName }} extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  @property()
  name = 'World';

  render() {
    return html`
      <h1>Hello, ${this.name}!</h1>
    `;
  }
}
