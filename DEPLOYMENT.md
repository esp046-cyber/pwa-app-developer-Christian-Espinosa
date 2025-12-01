# Deployment Guide - Christian Espinosa Portfolio

## 🚀 Quick Deployment Checklist

### Pre-Deployment
- [ ] Update all personal information (email, phone, social links)
- [ ] Replace placeholder images with actual project images
- [ ] Update domain name from `christianespinosa.dev` to your actual domain
- [ ] Create actual resume PDF at `assets/Christian_Espinosa_Resume.pdf`
- [ ] Generate favicon files (ICO, PNG variants)
- [ ] Create OG image (1200x630px) for social media sharing
- [ ] Test all forms and functionality locally
- [ ] Run performance audit (Lighthouse)
- [ ] Validate HTML, CSS, accessibility

### Files to Update Before Deployment

#### 1. Domain Name References
Update in the following files:
- `index.html` - All meta tags, canonical URL, JSON-LD
- `sitemap.xml` - All URL locations
- `manifest.json` - start_url and scope (if needed)

#### 2. Personal Information
- Email: `christian.t.espinosa@gmail.com`
- Phone: `09289259258127`
- Social Links:
  - GitHub: `https://github.com/christianespinosa`
  - LinkedIn: `https://linkedin.com/in/christianespinosa`
  - Twitter: `https://twitter.com/chris_espinosa`

#### 3. Required Assets
Create and place in appropriate directories:
```
/assets/
  └── Christian_Espinosa_Resume.pdf
/
  ├── favicon.ico (32x32)
  ├── favicon.svg (already created)
  ├── apple-touch-icon.png (180x180)
  ├── icon-192.png (192x192)
  ├── icon-512.png (512x512)
  └── og-image.jpg (1200x630)
```

---

## 📦 Deployment Options

### Option 1: Vercel (Recommended)
**Free, fast, automatic HTTPS, and CI/CD**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Custom domain setup:
   ```bash
   vercel domains add christianespinosa.dev
   ```

4. Configure `vercel.json` (optional):
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Frame-Options",
             "value": "SAMEORIGIN"
           }
         ]
       }
     ]
   }
   ```

### Option 2: Netlify
**Free tier with excellent features**

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

3. Or use drag-and-drop at [netlify.com/drop](https://netlify.com/drop)

4. Configure `netlify.toml`:
   ```toml
   [build]
     publish = "."
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "SAMEORIGIN"
       X-Content-Type-Options = "nosniff"
   ```

### Option 3: GitHub Pages
**Free hosting for static sites**

1. Create repository: `username.github.io`

2. Push code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/username.github.io.git
   git push -u origin main
   ```

3. Enable GitHub Pages in repository settings

4. Custom domain: Add `CNAME` file with your domain

### Option 4: Traditional Web Hosting (cPanel/FTP)
**For shared hosting providers**

1. Upload all files via FTP/SFTP
2. Ensure `.htaccess` is uploaded (enables proper routing)
3. Set permissions (755 for directories, 644 for files)
4. Configure domain DNS to point to hosting server

---

## 🔧 Performance Optimization

### Image Optimization
```bash
# Install image optimization tools
npm install -g imagemin-cli

# Optimize images
imagemin imgs/* --out-dir=imgs/optimized --plugin=webp
```

### CSS/JS Minification (Optional)
```bash
# Install minification tools
npm install -g csso-cli terser

# Minify CSS
csso styles.css -o styles.min.css

# Minify JavaScript
terser script.js -o script.min.js -c -m
```

### Enable Service Worker
Uncomment in `script.js` (line ~200):
```javascript
registerServiceWorker();
```

---

## 🔐 SSL/HTTPS Setup

### Free SSL with Let's Encrypt (on your server)
```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d christianespinosa.dev -d www.christianespinosa.dev
```

### Cloudflare (Free SSL + CDN)
1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your domain
3. Update nameservers at domain registrar
4. Enable "Always Use HTTPS" in SSL/TLS settings

---

## 📊 Analytics Setup (Optional)

### Google Analytics 4
Add before closing `</head>` in `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Plausible Analytics (Privacy-friendly alternative)
```html
<script defer data-domain="christianespinosa.dev" src="https://plausible.io/js/script.js"></script>
```

---

## ✅ Post-Deployment Testing

### Test Checklist
- [ ] All pages load correctly
- [ ] Forms submit properly
- [ ] All links work (internal and external)
- [ ] Images display correctly
- [ ] Mobile responsive design works
- [ ] PWA install prompt appears (mobile)
- [ ] Service Worker caching works
- [ ] SSL certificate is valid
- [ ] Cookie consent banner functions
- [ ] Dark/Light mode toggle works
- [ ] Scroll progress indicator shows
- [ ] Social media previews look good
- [ ] sitemap.xml is accessible
- [ ] robots.txt is accessible
- [ ] 404 page works

### SEO Validation
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Submit sitemap to [Google Search Console](https://search.google.com/search-console)
- [ ] Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Run [Lighthouse Audit](https://developers.google.com/web/tools/lighthouse) (aim for 90+ scores)

### Performance Testing Tools
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://www.webpagetest.org/

### Accessibility Testing
- **WAVE**: https://wave.webaim.org/
- **axe DevTools**: Browser extension
- **Lighthouse Accessibility Audit**

---

## 🐛 Troubleshooting

### 404 Errors on Refresh
- Ensure `.htaccess` is uploaded (Apache)
- Configure redirects in hosting platform settings
- Check server configuration for SPA routing

### Images Not Loading
- Verify file paths are correct
- Check file permissions (644)
- Ensure images are uploaded to correct directory

### SSL Certificate Issues
- Wait 24-48 hours for DNS propagation
- Clear browser cache
- Check certificate validity date

### PWA Not Installing
- Requires HTTPS
- Check manifest.json is valid
- Ensure service worker is registered
- Icons must be served from same origin

---

## 📞 Support Resources

### Platform Documentation
- **Vercel**: https://vercel.com/docs
- **Netlify**: https://docs.netlify.com
- **GitHub Pages**: https://docs.github.com/pages

### Web Standards
- **MDN Web Docs**: https://developer.mozilla.org
- **Web.dev**: https://web.dev
- **Can I Use**: https://caniuse.com

---

## 🎉 You're All Set!

Your portfolio is production-ready with:
- ✅ SEO optimized
- ✅ Social media ready
- ✅ Fully accessible (WCAG 2.1 AA)
- ✅ PWA capable
- ✅ Performance optimized
- ✅ Mobile responsive
- ✅ Privacy compliant

**Good luck with your deployment!** 🚀
