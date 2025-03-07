/**
 * Replaces placeholders in a template string with provided values
 */
export const hydrateTemplate = (
  template: string,
  replacements: Record<string, string>,
): string => {
  let hydratedTemplate = template
  for (const [placeholder, value] of Object.entries(replacements)) {
    hydratedTemplate = hydratedTemplate.replaceAll(placeholder, value)
  }
  return hydratedTemplate
}
