export function validateInput(value: string): string | null {
  if (value === "") {
    return "Cell Can't be Empty";
  }

  if (value.length > 30) {
    return `Task name character limit: ${value.length} / 30`;
  }

  return null;
}
