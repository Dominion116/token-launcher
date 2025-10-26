// src/lib/media.ts

/**
 * Normalize user-supplied or on-chain metadata URIs into direct, viewable image URLs.
 * Supports IPFS, Arweave, and Imgur page links.
 */
export function normalizeImageUrl(raw?: string): string {
    if (!raw) return '';
    let u = raw.trim();
  
    // ipfs://CID[/path]
    if (u.startsWith('ipfs://')) {
      const path = u.replace('ipfs://', '');
      return `https://ipfs.io/ipfs/${path}`;
    }
  
    // arweave id or arweave.net/id
    if (/^[A-Za-z0-9_-]{43,}$/.test(u) && !u.includes('.')) {
      return `https://arweave.net/${u}`;
    }
    if (u.includes('arweave.net/')) return u;
  
    // Imgur page → direct image
    try {
      const url = new URL(u);
      if (url.hostname === 'imgur.com') {
        const parts = url.pathname.split('/').filter(Boolean);
        const id = parts.pop();
        if (id) return `https://i.imgur.com/${id}.png`;
      }
    } catch {
      /* not a URL, ignore */
    }
  
    return u;
  }
  
  export const PLACEHOLDER_IMG = 'https://via.placeholder.com/128?text=Token';
  