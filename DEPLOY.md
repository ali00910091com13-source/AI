# انتشار «خیال‌نگار» روی GitHub Pages

## چرا قبلاً باز نمی‌شد؟
Vite به‌صورت پیش‌فرض مسیر فایل‌ها را مطلق (`/assets/...`) تولید می‌کند؛ اما GitHub Pages سایت را زیر یک زیرمسیر (`username.github.io/repo-name/`) سرو می‌کند و آن فایل‌ها ۴۰۴ می‌شدند. حالا با `base: "./"` در `vite.config.js` همه‌ی مسیرها نسبی‌اند و همه‌جا باز می‌شود.

## مراحل انتشار

1. ریپازیتوری بساز و پروژه را پوش کن:
```bash
git init
git add .
git commit -m "khayal-negar"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

2. بیلد بگیر:
```bash
npm install
npm run build
```

3. محتوای پوشه‌ی `dist` را منتشر کن. دو راه ساده:

**راه اول — اکشن رسمی Vite (پیشنهادی):** فایل `.github/workflows/deploy.yml` را با محتوای [vite-deploy](https://github.com/marketplace/actions/deploy-vite-app-to-github-pages) بساز یا از الگوی رسمی `actions/deploy-pages` استفاده کن؛ سپس در Settings → Pages، منبع را روی **GitHub Actions** بگذار.

**راه دوم — شاخه‌ی `gh-pages`:**
```bash
npm run build
npx gh-pages -d dist
```
و در Settings → Pages، شاخه را روی `gh-pages` بگذار.

4. چند دقیقه صبر کن؛ سایت این‌جا بالا می‌آید:
`https://USERNAME.github.io/REPO/`

## نکته‌ها
- سایت کاملاً استاتیک است و به سرور نیاز ندارد؛ API تصاویر (Pollinations) مستقیم از مرورگر کاربر صدا زده می‌شود.
- گالری و آمار در `localStorage` مرورگر هر کاربر ذخیره می‌شود.
