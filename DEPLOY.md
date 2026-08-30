# انتشار «خیال‌نگار» روی GitHub Pages

## چرا قبلاً باز نمی‌شد؟
Vite به‌صورت پیش‌فرض مسیر فایل‌ها را مطلق (`/assets/...`) تولید می‌کند؛ اما GitHub Pages سایت را زیر یک زیرمسیر (`username.github.io/repo-name/`) سرو می‌کند و آن فایل‌ها ۴۰۴ می‌شدند و صفحه سفید می‌ماند. حالا با `base: "./"` در `vite.config.js` همه‌ی مسیرها نسبی‌اند و سایت همه‌جا باز می‌شود.

## انتشار خودکار (پیشنهادی — فقط ۳ قدم)

فایل `.github/workflows/deploy.yml` داخل پروژه آماده است.

1. ریپازیتوری بساز و پروژه را پوش کن:
```bash
git init
git add .
git commit -m "khayal-negar"
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

2. در گیت‌هاب برو به:
**Settings → Pages → Source** و آن را روی **GitHub Actions** بگذار (نه «Deploy from a branch»).

3. تمام! با هر `git push` اکشن اجرا می‌شود و بعد از ۱ تا ۲ دقیقه سایت این‌جاست:
`https://USERNAME.github.io/REPO/`

اگر اکشن را در تب Actions ندیدی، یک‌بار دستی اجرا کن: تب **Actions → Deploy to GitHub Pages → Run workflow**.

## راه جایگزین — شاخه‌ی `gh-pages`
```bash
npm install
npm run build
npx gh-pages -d dist
```
و در **Settings → Pages** شاخه را روی `gh-pages` بگذار.

## نکته‌ها
- سایت کاملاً استاتیک است؛ API تصویر (Pollinations / Flux) مستقیم از مرورگر کاربر صدا زده می‌شود و به سرور و کلید API نیاز ندارد.
- تولید هر تصویر معمولاً ۱۰ تا ۶۰ ثانیه طول می‌کشد؛ این طبیعی است.
- «پرامپت‌نویس هوشمند» توصیف فارسی را با هوش مصنوعی به پرامپت انگلیسیِ دقیق تبدیل می‌کند تا تصویر درست‌تری بگیری؛ اگر خواستی خاموشش کن، از کنسول ساخت ممکن است.
