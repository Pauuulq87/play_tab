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

export const fetchAllPreviewImages = async (pageUrl: string): Promise<string[]> => {
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

    if (!res.ok) return [];

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const images = new Set<string>();

    // 1. Meta tags
    const metaSelectors = [
      'meta[property="twitter:image"]',
      'meta[name="twitter:image"]',
      'meta[property="og:image"]',
      'meta[name="og:image"]',
      'link[rel="image_src"]'
    ];
    
    metaSelectors.forEach(selector => {
      const content = doc.querySelector<HTMLMetaElement>(selector)?.getAttribute('content');
      if (content) {
        const resolved = resolveUrl(content, pageUrl);
        if (resolved) images.add(resolved);
      }
    });

    // 2. Favicon (sometimes useful as a fallback)
    const faviconSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]'
    ];
    faviconSelectors.forEach(selector => {
      const href = doc.querySelector<HTMLLinkElement>(selector)?.getAttribute('href');
      if (href) {
        const resolved = resolveUrl(href, pageUrl);
        if (resolved) images.add(resolved);
      }
    });

    // 3. Img tags (heuristic: try to get some large images)
    const imgTags = Array.from(doc.querySelectorAll('img'));
    imgTags.forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        const resolved = resolveUrl(src, pageUrl);
        if (resolved) {
          // Filter out tiny tracking pixels or icons if possible by path, but simpler to just add them
          // and let the user see them.
          images.add(resolved);
        }
      }
    });

    return Array.from(images).slice(0, 20); // Limit to 20 images
  } catch (error) {
    console.error('Failed to fetch all images:', error);
    return [];
  }
};

