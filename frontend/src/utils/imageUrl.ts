/**
 * Normalizes a photo/avatar URL to a proper relative URL.
 * Handles legacy records in the DB that may have stored absolute disk paths
 * (e.g. "C:/Users/.../public/uploads/photos/photo-xxx.jpg") instead of the
 * correct relative URL ("/uploads/photos/photo-xxx.jpg").
 */
export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // Already a proper absolute HTTP/HTTPS URL – return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // Already a correct relative URL path
  if (url.startsWith('/uploads/')) return url;

  // Find the "/uploads/" segment inside an absolute disk path and extract
  // everything from that point onward (works for both Windows and POSIX paths)
  const idx = url.indexOf('/uploads/');
  if (idx !== -1) return url.slice(idx);

  // Windows backslash variant: replace backslashes first, then retry
  const normalized = url.replace(/\\/g, '/');
  const idx2 = normalized.indexOf('/uploads/');
  if (idx2 !== -1) return normalized.slice(idx2);

  // If it's just a bare filename (e.g. "nagajothi_p.jpg"), prefix with
  // "/uploads/" so the browser will request the file from the uploads
  // directory.  This covers legacy records that lost their path segment.
  if (/^[^\/]+\.[^\/]+$/.test(url)) {
    return `/uploads/${url}`;
  }

  // Unknown format – return as-is and let the browser decide
  return url;
}
