export interface AppDOM {
  alert: HTMLElement;
  inputContainer: HTMLElement;

  modeBtn: HTMLInputElement;
  themeText: HTMLElement;

  tasksList: HTMLUListElement;
  filterButtons: NodeListOf<HTMLButtonElement>;

  input: HTMLInputElement;
  addBtn: HTMLInputElement;

  deleteAllBtn: HTMLButtonElement;
  filtersContainer: HTMLElement;

  form: HTMLFormElement,
}
