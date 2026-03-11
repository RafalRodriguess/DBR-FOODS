import { apiBaseUrl, getAuthHeaders } from './api';

export type SiteSettings = {
  contact_location: string;
  contact_email: string;
  contact_phone: string;
  contact_map_embed_url: string;
};

const DEFAULTS: SiteSettings = {
  contact_location: 'Shannonweg 81-83, 3197, Rotterdam - Netherlands',
  contact_email: 'diego@dbr-foods.com',
  contact_phone: '+31 6 85008474',
  contact_map_embed_url:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2462.404557997384!2d4.341108212450419!3d51.89010047178351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c44be49f50f493%3A0xe5a3c07f43b6771e!2sShannonweg%2081%2C%203197%20LG%20Rotterdam!5e0!3m2!1sen!2snl!4v1700000000000!5m2!1sen!2snl',
};

function normalize(raw: unknown): SiteSettings {
  const data = (raw as { site_settings?: Partial<SiteSettings> })?.site_settings ?? {};
  return {
    contact_location: String(data.contact_location ?? DEFAULTS.contact_location),
    contact_email: String(data.contact_email ?? DEFAULTS.contact_email),
    contact_phone: String(data.contact_phone ?? DEFAULTS.contact_phone),
    contact_map_embed_url: String(data.contact_map_embed_url ?? DEFAULTS.contact_map_embed_url),
  };
}

export async function getSiteSettingsPublic(): Promise<SiteSettings> {
  const res = await fetch(`${apiBaseUrl}/api/site-settings/public`, { headers: { Accept: 'application/json' } });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as unknown;
  if (!res.ok) return DEFAULTS;
  return normalize(data);
}

export async function getSiteSettingsAdmin(): Promise<SiteSettings> {
  const res = await fetch(`${apiBaseUrl}/api/site-settings`, { headers: getAuthHeaders() });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as unknown;
  if (!res.ok) throw new Error((raw as { message?: string })?.message ?? 'Erro ao carregar dados.');
  return normalize(data);
}

export async function updateSiteSettingsAdmin(payload: SiteSettings): Promise<SiteSettings> {
  const res = await fetch(`${apiBaseUrl}/api/site-settings`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as unknown;
  if (!res.ok) throw new Error((raw as { message?: string })?.message ?? 'Erro ao salvar dados.');
  return normalize(data);
}
