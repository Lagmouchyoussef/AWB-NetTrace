import { DeviceType } from '../../roles/super-admin/pages/devices/device.model';
import { resolveCssColor } from './css-color.util';

// Flat, single-color line icons (white-on-badge, Packet-Tracer-style device glyphs) rendered as
// inline SVG data URIs so they can be used directly as Cytoscape node background-images with no
// external font/asset dependency - a data: URI is a self-contained resource and can't reach the
// page's own self-hosted icon font.
const ICON_PATHS: Record<DeviceType, string> = {
  ROUTER: `
    <circle cx="12" cy="12" r="7.5" fill="none" stroke="#fff" stroke-width="1.6"/>
    <path d="M6 9.5 L4.3 8 M6 9.5 L7.5 8.2 M6 9.5 L5.3 11.3" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18 14.5 L19.7 16 M18 14.5 L16.5 15.8 M18 14.5 L18.7 12.7" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="12" r="1.6" fill="#fff"/>
  `,
  SWITCH: `
    <rect x="4" y="7" width="16" height="7" rx="1.2" fill="none" stroke="#fff" stroke-width="1.6"/>
    <rect x="6" y="9.3" width="2" height="2.4" fill="#fff"/>
    <rect x="9.5" y="9.3" width="2" height="2.4" fill="#fff"/>
    <rect x="13" y="9.3" width="2" height="2.4" fill="#fff"/>
    <rect x="16.5" y="9.3" width="2" height="2.4" fill="#fff"/>
    <path d="M7 17 h10 M7 17 l1.6 -1.6 M7 17 l1.6 1.6 M17 17 l-1.6 -1.6 M17 17 l-1.6 1.6" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>
  `,
  SERVER: `
    <rect x="5" y="4.5" width="14" height="4.2" rx="0.8" fill="none" stroke="#fff" stroke-width="1.5"/>
    <rect x="5" y="9.9" width="14" height="4.2" rx="0.8" fill="none" stroke="#fff" stroke-width="1.5"/>
    <rect x="5" y="15.3" width="14" height="4.2" rx="0.8" fill="none" stroke="#fff" stroke-width="1.5"/>
    <circle cx="16.3" cy="6.6" r="0.9" fill="#fff"/>
    <circle cx="16.3" cy="12" r="0.9" fill="#fff"/>
    <circle cx="16.3" cy="17.4" r="0.9" fill="#fff"/>
  `,
  GPU_AI_NODE: `
    <rect x="6" y="6" width="12" height="12" rx="1" fill="none" stroke="#fff" stroke-width="1.6"/>
    <rect x="9.5" y="9.5" width="5" height="5" fill="none" stroke="#fff" stroke-width="1.3"/>
    <path d="M8 3.5 v2.5 M12 3.5 v2.5 M16 3.5 v2.5 M8 18 v2.5 M12 18 v2.5 M16 18 v2.5 M3.5 8 h2.5 M3.5 12 h2.5 M3.5 16 h2.5 M18 8 h2.5 M18 12 h2.5 M18 16 h2.5" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>
  `,
  FIREWALL: `
    <rect x="4.5" y="5" width="15" height="14" rx="1" fill="none" stroke="#fff" stroke-width="1.6"/>
    <path d="M4.5 9.2 h15 M4.5 13.4 h15 M4.5 17.6 h15" stroke="#fff" stroke-width="1.1"/>
    <path d="M9 5 v4.2 M15 5 v4.2 M12 9.2 v4.2 M9 13.4 v4.2 M15 13.4 v4.2" stroke="#fff" stroke-width="1.1"/>
  `,
  LOAD_BALANCER: `
    <circle cx="12" cy="6" r="2" fill="none" stroke="#fff" stroke-width="1.5"/>
    <circle cx="6" cy="18" r="2" fill="none" stroke="#fff" stroke-width="1.5"/>
    <circle cx="12" cy="18" r="2" fill="none" stroke="#fff" stroke-width="1.5"/>
    <circle cx="18" cy="18" r="2" fill="none" stroke="#fff" stroke-width="1.5"/>
    <path d="M12 8 v3 M12 11 L6 16 M12 11 L12 16 M12 11 L18 16" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>
  `,
  STORAGE_ARRAY: `
    <rect x="5" y="5.5" width="14" height="4" rx="0.7" fill="none" stroke="#fff" stroke-width="1.5"/>
    <rect x="5" y="10.2" width="14" height="4" rx="0.7" fill="none" stroke="#fff" stroke-width="1.5"/>
    <rect x="5" y="14.9" width="14" height="4" rx="0.7" fill="none" stroke="#fff" stroke-width="1.5"/>
    <circle cx="8" cy="7.5" r="0.8" fill="#fff"/>
    <circle cx="8" cy="12.2" r="0.8" fill="#fff"/>
    <circle cx="8" cy="16.9" r="0.8" fill="#fff"/>
  `,
  PDU: `
    <rect x="8.5" y="3.5" width="7" height="17" rx="1.4" fill="none" stroke="#fff" stroke-width="1.6"/>
    <circle cx="12" cy="8" r="1.3" fill="none" stroke="#fff" stroke-width="1.2"/>
    <circle cx="12" cy="12" r="1.3" fill="none" stroke="#fff" stroke-width="1.2"/>
    <circle cx="12" cy="16" r="1.3" fill="none" stroke="#fff" stroke-width="1.2"/>
  `,
  UPS: `
    <rect x="5" y="7" width="14" height="11" rx="1.2" fill="none" stroke="#fff" stroke-width="1.6"/>
    <rect x="10" y="4.5" width="4" height="2.5" fill="#fff"/>
    <path d="M13.2 9.5 L9.8 13.8 h2.4 l-1.4 4.2 4.4 -5.4 h-2.4 z" fill="#fff"/>
  `,
  COOLING_UNIT: `
    <circle cx="12" cy="12" r="8" fill="none" stroke="#fff" stroke-width="1.4"/>
    <path d="M12 5 v3.3 M12 15.7 v3.3 M5 12 h3.3 M15.7 12 h3.3 M7 7 l2.3 2.3 M14.7 14.7 L17 17 M17 7 l-2.3 2.3 M9.3 14.7 L7 17" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>
    <circle cx="12" cy="12" r="1.6" fill="#fff"/>
  `,
  OTHER: `
    <rect x="5" y="5" width="14" height="14" rx="2" fill="none" stroke="#fff" stroke-width="1.6"/>
    <path d="M12 9.5c1.1 0 2 .7 2 1.6 0 1-1 1.3-1.5 1.9-.3.4-.5.7-.5 1.3" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="16.6" r="0.9" fill="#fff"/>
  `,
};

// Only 5 tokens in the palette are genuinely distinct hues (the rest, --chart-ordinal-1..5, are
// a single-hue severity ramp - reusing them here for unrelated device types produced a muddy
// wall of near-identical pinkish-reds). Those 5 go to the device types that actually define a
// network path (routers, switches, firewalls, load balancers, servers); everything else shares
// one neutral "supporting infrastructure" tone and relies on its icon glyph to read as distinct.
const BADGE_COLOR: Record<DeviceType, string> = {
  ROUTER: 'var(--chart-series-1)',
  SWITCH: 'var(--chart-good)',
  FIREWALL: 'var(--chart-critical)',
  LOAD_BALANCER: 'var(--chart-serious)',
  SERVER: 'var(--chart-warning)',
  GPU_AI_NODE: 'var(--awb-on-surface-muted)',
  STORAGE_ARRAY: 'var(--awb-on-surface-muted)',
  PDU: 'var(--awb-on-surface-muted)',
  UPS: 'var(--awb-on-surface-muted)',
  COOLING_UNIT: 'var(--awb-on-surface-muted)',
  OTHER: 'var(--awb-on-surface-muted)',
};

function toDataUri(innerSvg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${innerSvg}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function deviceIconDataUri(deviceType: DeviceType): string {
  return toDataUri(ICON_PATHS[deviceType] ?? ICON_PATHS.OTHER);
}

export function deviceBadgeColor(deviceType: DeviceType): string {
  return resolveCssColor(BADGE_COLOR[deviceType] ?? BADGE_COLOR.OTHER);
}
