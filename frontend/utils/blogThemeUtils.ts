/**
 * Funções partilhadas para processar resultado do crawl (Tavily) e criar temas (uso em Pesquisa e Gerar temas).
 */
import type { BlogCategory } from './blogApi';

export function contentFromScrapeResult(result: unknown): string {
  if (result == null) return '';
  if (typeof result === 'string') return result;
  const obj = result as Record<string, unknown>;
  if (typeof obj.raw_content === 'string') return obj.raw_content;
  if (typeof obj.markdown === 'string') return obj.markdown;
  if (typeof obj.content === 'string') return obj.content;
  if (typeof obj.text === 'string') return obj.text;
  return JSON.stringify(result, null, 2);
}

export function getDisplayText(result: unknown): string {
  if (result == null) return '';
  if (typeof result === 'string') return result;
  const obj = result as Record<string, unknown>;
  const raw =
    (typeof obj.raw_content === 'string' ? obj.raw_content : null) ??
    (typeof obj.text === 'string' ? obj.text : null) ??
    (typeof obj.content === 'string' ? obj.content : null) ??
    (typeof obj.markdown === 'string' ? obj.markdown : null);
  if (raw) return raw;
  return JSON.stringify(result, null, 2);
}

/** Número de caracteres a usar para matching de categorias (evita ruído de footer, menus, etc.). */
const TEXT_FOR_MATCHING_LENGTH = 14000;

/**
 * Extrai o trecho do texto mais relevante para matching (início do conteúdo, onde costuma estar o artigo).
 */
function textForMatching(text: string): string {
  if (!text || text.length <= TEXT_FOR_MATCHING_LENGTH) return text;
  const slice = text.slice(0, TEXT_FOR_MATCHING_LENGTH);
  const footerMarkers = ['copyright', 'all rights reserved', 'subscribe to our', 'newsletter', 'follow us on', 'privacy policy', 'terms of use'];
  const lower = slice.toLowerCase();
  let cut = TEXT_FOR_MATCHING_LENGTH;
  for (const marker of footerMarkers) {
    const idx = lower.indexOf(marker);
    if (idx !== -1 && idx < cut) cut = idx;
  }
  return slice.slice(0, cut);
}

export function matchCategoriesInText(text: string, categories: BlogCategory[]): string[] {
  if (!text || !categories.length) return [];
  const toMatch = textForMatching(text);
  const lower = toMatch.toLowerCase();
  const found = categories.filter((c) => {
    if (!c.name) return false;
    const nameLower = c.name.toLowerCase();
    if (lower.includes(nameLower)) return true;
    if (c.slug) {
      const slugAsWords = c.slug.replace(/-/g, ' ');
      if (lower.includes(slugAsWords) || lower.includes(c.slug)) return true;
    }
    const nameSingular = nameLower.replace(/\bs$/, '');
    if (nameSingular !== nameLower && nameSingular.length > 2 && lower.includes(nameSingular)) return true;
    return false;
  }).map((c) => c.name);
  return [...new Set(found)].sort((a, b) => a.localeCompare(b));
}

export function generateTitleFromTopics(topics: string[]): string {
  if (topics.length === 0) return '';
  if (topics.length === 1) return `Novidades sobre ${topics[0]}`;
  if (topics.length === 2) return `${topics[0]} e ${topics[1]}`;
  return `${topics.slice(0, 2).join(', ')} e mais`;
}

const UI_NOISE_STARTS = [
  'sign in', 'subscribe', 'subscriptions', 'continue to', 'you searched', 'search', 'what are you',
  'jump to', 'notifications', 'cookie', 'login', 'menu', 'result for', 'latest', 'about us', 'explore our',
  'copyright', 'insert/', 'edit link', 'forgot your', 'enter the', 'reset password', 'verify', 'save password',
  'link text', 'open link', 'cancel', 'no search term', 'privacy policy', 'terms', 'advertise', 'editorial',
  'close', 'or link to', 'use of this', 'the material on', 'rodman media', 'type of content', 'search by',
  'topics', 'x', 'advertise with', 'insert/edit',
];

export function extractTitleFromContent(text: string, urlFallback?: string): string {
  if (!text || typeof text !== 'string') return '';
  const lower = text.toLowerCase();
  const resultMatch = text.match(/Result\s+for\s+["']([^"']+)["']/i) || lower.match(/result\s+for\s+["']?([^"'\n]+)["']?/);
  if (resultMatch?.[1]) {
    const query = resultMatch[1].trim();
    if (query.length > 0 && query.length < 80) {
      const capitalized = query.replace(/\b\w/g, (c) => c.toUpperCase());
      return `${capitalized}: Latest News and Trends`;
    }
  }
  if (urlFallback) {
    try {
      const u = new URL(urlFallback);
      const s = u.searchParams.get('s') || u.searchParams.get('q') || u.searchParams.get('search');
      if (s && s.length > 0 && s.length < 80) {
        const decoded = decodeURIComponent(s.replace(/\+/g, ' ')).trim();
        const capitalized = decoded.replace(/\b\w/g, (c) => c.toUpperCase());
        return `${capitalized}: Latest News and Trends`;
      }
    } catch {
      // ignore
    }
  }
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const clean = line.replace(/^\*?\s*/, '').trim();
    if (clean.length < 15 || clean.length > 120) continue;
    const lineLower = clean.toLowerCase();
    if (UI_NOISE_STARTS.some((s) => lineLower.startsWith(s))) continue;
    if (/^[\d\s\-–—:]+$/.test(clean)) continue;
    if (/^(topics|type of content|search by|magazine|breaking|videos|podcasts|library)$/i.test(clean)) continue;
    return clean;
  }
  return '';
}
