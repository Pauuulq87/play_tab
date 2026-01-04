const getFirstMetaContent = (doc: Document, selectors: string[]): string | null => {
  for (const selector of selectors) {
    const el = doc.querySelector<HTMLMetaElement>(selector);
    const content = el?.getAttribute('content')?.trim();
    if (content) return content;
  }
  return null;
};

const resolveUrl = (maybeRelative: string, baseUrl: string): string | null => {
  try {
    return new URL(maybeRelative, baseUrl).toString();
  } catch {
    return null;
  }
};

export const fetchPreviewImageUrl = async (pageUrl: string): Promise<string | null> => {
  try {
    const res = await fetch(pageUrl, {
      method: 'GET',
      redirect: 'follow',
      credentials: 'omit',
      cache: 'force-cache',
      headers: {
        Accept: 'text/html,application/xhtml+xml'
      }
    });

    if (!res.ok) return null;

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const raw =
      getFirstMetaContent(doc, [
        'meta[property="twitter:image"]',
        'meta[name="twitter:image"]',
        'meta[property="og:image"]',
        'meta[name="og:image"]',
        'link[rel="image_src"]'
      ]) ||
      doc.querySelector<HTMLLinkElement>('link[rel="image_src"]')?.href ||
      null;

    if (!raw) return null;
    return resolveUrl(raw, pageUrl);
  } catch {
    return null;
  }
};

