export type StylePreset = { id: string; label: string; tokens: string };
export type Ratio = { id: string; label: string; w: number; h: number };
export type ModelOption = { id: string; label: string; desc: string };
export type Surprise = { fa: string; en: string };

export const STYLES: StylePreset[] = [
  { id: 'none', label: 'آزاد', tokens: '' },
  { id: 'photo', label: 'واقع‌گرایانه', tokens: 'photorealistic, 8k, sharp focus, natural light, highly detailed' },
  { id: 'cinema', label: 'سینمایی', tokens: 'cinematic film still, anamorphic lens, film grain, dramatic lighting, 35mm' },
  { id: 'anime', label: 'انیمه', tokens: 'anime style, vibrant colors, detailed background, cel shading' },
  { id: 'water', label: 'آبرنگ', tokens: 'delicate watercolor painting, soft color washes, textured cold-press paper' },
  { id: 'oil', label: 'کلاسیک', tokens: 'classical oil painting, chiaroscuro, renaissance, rich canvas texture' },
  { id: 'cyber', label: 'سایبرپانک', tokens: 'cyberpunk, neon glow, rainy futuristic city, high contrast, moody' },
  { id: 'render', label: 'سه‌بعدی', tokens: '3d render, octane render, soft studio lighting, subsurface scattering' },
  { id: 'pixel', label: 'پیکسلی', tokens: 'pixel art, 16-bit, retro game, crisp pixels, limited palette' },
  { id: 'mini', label: 'مینیمال', tokens: 'minimalist flat illustration, clean geometric shapes, limited pastel palette' },
];

export const RATIOS: Ratio[] = [
  { id: 'sq', label: 'مربع', w: 1024, h: 1024 },
  { id: 'p43', label: 'افقی', w: 1152, h: 896 },
  { id: 'p34', label: 'عمودی', w: 896, h: 1152 },
  { id: 'w16', label: 'عریض', w: 1280, h: 720 },
  { id: 't916', label: 'استوری', w: 720, h: 1280 },
];

export const MODELS: ModelOption[] = [
  { id: 'flux', label: 'Flux', desc: 'کیفیت بالا · جزئیات دقیق' },
  { id: 'turbo', label: 'Turbo', desc: 'سریع · مناسب ایده‌پردازی' },
];

export const COUNTS = [1, 2, 4];

export const SURPRISES: Surprise[] = [
  { fa: 'گربهٔ فضانورد', en: 'an astronaut cat floating inside a space station, Earth glowing through the window, cinematic lighting, ultra detailed' },
  { fa: 'کوچهٔ نئونی بارانی', en: 'a rainy neon-lit alley in Tokyo at night, wet asphalt reflections, steam from food stalls, moody cinematic atmosphere' },
  { fa: 'نهنگِ ابرها', en: 'a giant whale swimming through golden clouds above a mountain village at sunrise, dreamy surrealism, volumetric light' },
  { fa: 'کتابخانهٔ بی‌پایان', en: 'an endless ancient library with floating books and warm hanging lanterns, dust in light beams, fantasy concept art' },
  { fa: 'ربات باغبان', en: 'a small rusty robot planting a glowing flower in a vast desert, dramatic backlight, emotional, photorealistic' },
  { fa: 'قایق روی کهکشان', en: 'a wooden rowboat drifting on a sea of stars and galaxies, lone fisherman silhouette, epic ultra wide shot' },
  { fa: 'کافهٔ پاییزی', en: 'a cozy autumn cafe window with raindrops, warm interior light, a cat sleeping on the windowsill, soft illustration' },
  { fa: 'اژدهای کاغذی', en: 'an origami paper dragon breathing tiny golden flames, macro photography, shallow depth of field, dark background' },
];

export type GenStatus = 'loading' | 'done' | 'error';

export type GenItem = {
  id: string;
  url: string;
  prompt: string;
  userPrompt: string;
  styleId: string;
  ratioId: string;
  modelId: string;
  seed: number;
  w: number;
  h: number;
  status: GenStatus;
  startedAt: number;
  duration?: number;
  attempt: number;
};

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
export const faDigits = (v: string | number) =>
  String(v).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

export const randomSeed = () => Math.floor(Math.random() * 2_000_000_000);

export const uid = () =>
  Math.random().toString(36).slice(2, 9) + Date.now().toString(36);

export function buildImageUrl(
  prompt: string,
  w: number,
  h: number,
  seed: number,
  model: string,
  attempt = 0,
): string {
  const base = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  const params = new URLSearchParams({
    width: String(w),
    height: String(h),
    seed: String(seed),
    model,
    nologo: 'true',
  });
  if (attempt > 0) params.set('retry', String(attempt));
  return `${base}?${params.toString()}`;
}

const ENHANCE_SYSTEM =
  'You are an expert prompt engineer for the Flux AI image model. The user describes an image, possibly in Persian/Farsi or another language. Translate the idea into English and rewrite it as ONE vivid, precise image-generation prompt. Preserve the user intent exactly; add concrete visual details about subject, environment, lighting, mood and composition. Output ONLY the final English prompt: no quotes, no prefixes, no explanations, maximum 70 words.';

/**
 * پرامپت کاربر (احتمالاً فارسی) را با هوش مصنوعی به یک پرامپت انگلیسیِ
 * دقیق و بهینه برای مدل تصویرساز تبدیل می‌کند.
 */
export async function enhancePrompt(
  userPrompt: string,
  styleTokens: string,
): Promise<string> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 25_000);
  try {
    const res = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        private: true,
        seed: randomSeed(),
        messages: [
          { role: 'system', content: ENHANCE_SYSTEM },
          { role: 'user', content: userPrompt },
        ],
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error('enhance request failed');
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    let text = data.choices?.[0]?.message?.content ?? '';
    text = text
      .replace(/^[\s"'`*_]+|[\s"'`*_]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length < 6) throw new Error('empty enhancement');
    text = text.slice(0, 420);
    return styleTokens ? `${text}, ${styleTokens}` : text;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function downloadImage(item: GenItem): Promise<void> {
  const res = await fetch(item.url);
  if (!res.ok) throw new Error('fetch failed');
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = `khayal-negar-${item.seed}.jpg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 4000);
}

export const styleById = (id: string) => STYLES.find((s) => s.id === id);
export const ratioById = (id: string) => RATIOS.find((r) => r.id === id);
