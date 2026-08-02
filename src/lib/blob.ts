import { put, del } from "@vercel/blob";

// File uploads (resume PDF, gallery photos) go to Vercel Blob in production,
// since — like the JSON content store — Vercel's filesystem is read-only at
// runtime. Falls back to writing into /public locally when no Blob store is
// connected (BLOB_READ_WRITE_TOKEN unset), which is what `npm run dev` uses.

export function blobAvailable(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function uploadToBlob(pathname: string, data: Buffer, contentType?: string): Promise<string> {
  const result = await put(pathname, data, {
    access: "public",
    addRandomSuffix: true,
    contentType,
  });
  return result.url;
}

export async function deleteFromBlob(url: string): Promise<void> {
  await del(url);
}
