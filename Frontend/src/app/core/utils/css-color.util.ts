const resolvedColorCache = new Map<string, string>();

// Cytoscape's canvas renderer parses style values with its own literal color parser
// (hex/rgb/hsl/named only) - it has no notion of the DOM's CSSOM, so a raw `var(--token)`
// string is never resolved and silently falls back to that property's built-in default.
// This resolves any CSS color expression (var(), light-dark(), etc.) to the literal rgb
// string the current theme actually renders, via a throwaway probe element, so cytoscape
// can use it directly. Results are cached since tokens don't change during a page's life.
export function resolveCssColor(cssValue: string): string {
  const cached = resolvedColorCache.get(cssValue);
  if (cached) {
    return cached;
  }
  const probe = document.createElement('span');
  probe.style.color = cssValue;
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color || cssValue;
  document.body.removeChild(probe);
  resolvedColorCache.set(cssValue, resolved);
  return resolved;
}
