import json,re,html
from pathlib import Path
from urllib.parse import urlsplit,unquote
posts=[]
for p in Path('src/data/blogs').glob('*.ts'):
 s=p.read_text(encoding='utf-8')
 if '/images/blog/' not in s or not s.startswith('export default {'):continue
 raw=s.removeprefix('export default ').strip().removesuffix(';')
 raw=re.sub(r'(?m)^  (\w+):',r'  "\1":',raw)
 posts.append(json.loads(raw))
errors=[];sitemap=Path('dist/sitemap.xml').read_text(); titles=set();descriptions=set()
for p in posts:
 slug=p['slug']; target=Path('dist/blogs')/slug/'index.html'
 if not target.exists():errors.append(slug+': missing HTML');continue
 page=target.read_text(encoding='utf-8')
 for value in [p['title'],p['description'],f'https://adibx.me/blogs/{slug}']:
  if value not in html.unescape(page):errors.append(slug+': missing metadata '+value)
 for heading in p['tableOfContents']:
  if f'id="{heading["id"]}"' not in page:errors.append(slug+': missing section')
 if p['slug'] not in sitemap:errors.append(slug+': sitemap')
 for token in ['BlogPosting','BreadcrumbList','https://adibx.me/#person','article:published_time','og:image','twitter:card']:
  if token not in page:errors.append(slug+': missing '+token)
 for asset in [p['coverImage'],p['coverImageSmall']]:
  if not (Path('dist')/asset.lstrip('/')).exists():errors.append(slug+': missing '+asset)
 count=len(re.sub('<[^>]+>',' ',p['content']).split())
 if count<800:errors.append(slug+': too short')
 if '\u2014' in p['content']:errors.append(slug+': em dash')
 for href in re.findall(r'href="([^"]+)"',p['content']):
  parsed=urlsplit(href)
  if href.startswith('/'):
   target=Path('dist')/unquote(parsed.path).strip('/')/'index.html'
   if not target.exists():errors.append(slug+': broken link '+href)
 titles.add(p['title']);descriptions.add(p['description'])
assert len(posts)==15 and len(titles)==15 and len(descriptions)==15
if errors:raise SystemExit('\n'.join(errors))
print('PASS: 15 full static articles, unique metadata, schemas, TOC anchors, sitemap entries, local covers and all content internal links.')
report=['# Blog implementation report','', 'Publication date: 24 November 2026. 15 original articles added; existing articles preserved. No CSS, layout, typography, colors, spacing, or animation changes were made for this task.','', '## Implementation','', '- Existing TS content modules and listing/article components reused.\n- Full article pages and metadata are prerendered by the existing production build.\n- Sitemap discovery includes all new slugs.\n- SEO descriptions, explicit canonical URLs and BreadcrumbList added without visual changes. Existing BlogPosting and author entity retained.\n- Reading time calculated from content at 200 words/minute.\n- Local 1600px and 800px WebP cover variants generated from existing author-supplied assets. Selected covers were subsequently updated with Pexels photos and artwork; see docs/blog-cover-sources.md for the six replacements and license credits.\n- README documents file-based publishing.','', '## Editorial qualifications','', '- No Bangladesh market price ranges, sales statistics, guaranteed rankings, or AI savings percentages are invented. The cost article explains quotation factors instead of presenting an unsupported price list.\n- Erasmus+, DIU, Windesheim, 038 Games and ABI project context follow the user-supplied verified brief. No completed-exchange date, scholarship amount, client feedback, or clinical outcome is asserted.\n- Named Hassocks Kebab and Ganjees Indian Hyde menu projects were not found. No invented case studies are included. The menu guide uses existing Green D stationery artwork as a print-design illustration, not as a restaurant menu example.\n- No verified public ABI screenshot or original Zwolle photograph was identified. The international articles use the author portrait and an original game-environment artwork, accurately described as illustrative. They do not claim to depict the ABI project or Zwolle.\n- Deployment to production was not requested or performed; live HTTP status and external social unfurling should be confirmed after the Vercel deployment.','', '## Sources checked','', '- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)\n- [WordPress official features](https://wordpress.org/about/features/)\n- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)\n- [W3C accessibility introduction](https://www.w3.org/WAI/fundamentals/accessibility-intro/)\n- [Erasmus+ study abroad](https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/studying-abroad)\n- [Food Standards Agency allergen guidance](https://www.food.gov.uk/business-guidance/allergen-guidance-for-food-businesses)\n- [OWASP LLM application security](https://owasp.org/www-project-top-10-for-large-language-model-applications/)\n- [GitHub Copilot responsible use](https://docs.github.com/en/copilot/responsible-use/copilot-code-completion)\n- [Unity manual](https://docs.unity3d.com/Manual/index.html)','','## Article inventory and metadata','']
for p in sorted(posts,key=lambda p:p['slug']):
 report += [f'### {p["title"]}',f'- URL: https://adibx.me/blogs/{p["slug"]}',f'- Content file: `src/data/blogs/{p["slug"]}.ts`',f'- SEO description: {p["description"]}',f'- Category: {p["category"]}; tags: {", ".join(p["tags"])}',f'- Length: {p["wordCount"]} words before related reading; publication: {p["isoDate"]}',f'- Cover: `{p["coverImage"]}` and 800px variant',f'- Source: `{p["imageSource"]}`; credit: {p["imageCredit"]}',f'- Usage: {p["imageLicense"]}',f'- Alt text: {p["coverImageAlt"]}','']
report+=['## Validation','','- Production build: passed TypeScript, sitemap, Vite and prerendering.\n- Content audit: all 15 articles exceed 800 words, all TOC anchors resolve, all local covers exist in dist, all article content internal routes exist, all new slugs are in sitemap, all new HTML includes title/description/canonical/BlogPosting/BreadcrumbList/social metadata.\n- Existing build warning: lottie-web uses eval; unrelated to blog content.','', '## Files changed or created','', '- 15 `src/data/blogs/<slug>.ts` files listed above.\n- 30 optimized covers in `public/images/blog/`.\n- `src/data/blogs.ts`: optional metadata fields and automatic reading time.\n- `src/pages/BlogDetails.tsx`: description, canonical and responsive image attributes only.\n- `src/components/SEO.tsx`: article breadcrumbs.\n- `README.md`: publishing workflow.\n- `public/sitemap.xml`: generated routes.\n- `scripts/verify-editorial.py`: repeatable content/static output audit.\n- `docs/blog-implementation-report.md`: this report.']
Path('docs').mkdir(exist_ok=True);Path('docs/blog-implementation-report.md').write_text('\n'.join(report),encoding='utf-8')
