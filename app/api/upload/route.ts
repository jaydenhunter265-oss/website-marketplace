import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// POST /api/upload — upload image to Cloudinary (auth required)
export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5 MB' },
        { status: 400 }
      );
    }

    const cloudName    = process.env.CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET!;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        { error: 'Image upload is not configured' },
        { status: 503 }
      );
    }

    const cloudForm = new FormData();
    cloudForm.append('file', file);
    cloudForm.append('upload_preset', uploadPreset);
    cloudForm.append('folder', 'futurimarket');

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: cloudForm }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error('Cloudinary error:', detail);
      return NextResponse.json(
        { error: 'Image upload failed' },
        { status: 502 }
      );
    }

    const { secure_url } = (await res.json()) as { secure_url: string };
    return NextResponse.json({ url: secure_url });
  } catch (err) {
    console.error('POST /api/upload:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
