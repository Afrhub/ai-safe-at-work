#!/usr/bin/env python3
import re, json
from pathlib import Path

BASE = 'https://aisafeatwork.org'
SEP = chr(92)

ORG = {
    "@type": "Organization",
    "@id": f"{BASE}/#organization",
    "name": "AI Safe@Work",
    "url": BASE + "/",
    "description": "Free, plain-English course on AI safety for non-technical SMB staff. EU-first. Standards-cited inline."
}
WEBSITE = {
    "@type": "WebSite",
    "@id": f"{BASE}/#website",
    "url": BASE + "/",
    "name": "AI Safe@Work",
    "publisher": {"@id": f"{BASE}/#organization"},
    "inLanguage": "en"
}

MODULE_META = {
    'module-1.html': ('Module 1 - Why this course exists', 'Three real incidents that cost real money. What AI risk actually means.'),
    'module-2.html': ('Module 2 - What AI tools do with what you type', 'Free vs paid vs enterprise tier; training opt-outs; retention; data location.'),
    'module-3.html': ('Module 3 - The never-paste list', 'Nine categories of data that should never go in a public AI tool.'),
    'module-4.html': ('Module 4 - Picking the right tool for the job', 'When the free tier is fine; when you need enterprise; vendor questions worth asking.'),
    'module-5.html': ('Module 5 - Verifying what the AI tells you', 'Hallucinations, two-source rule, EU AI Act Article 14 human oversight.'),
    'module-6.html': ('Module 6 - AI-powered scams aimed at you', 'Spear-phishing 2.0, voice cloning, video deepfakes, the callback principle.'),
    'module-7.html': ('Module 7 - Bias, fairness, and not embarrassing the business', 'AI in hiring, customer-facing bots, marketing copy that excludes; Annex III high-risk categories.'),
    'module-8.html': ('Module 8 - Copyright, IP, and other peoples content', 'Input vs output copyright; AI-generated material in commercial use; the ongoing lawsuits.'),
    'module-9.html': ('Module 9 - Logging, accountability, and who used what', 'The minimum useful AI-use log; GDPR Article 22; right to explanation.'),
    'module-10.html': ('Module 10 - When something goes wrong', 'Incident response in plain English; the 72-hour breach clock; how to escalate.'),
    'module-11.html': ('Module 11 - The 60-second pre-submit checklist', 'Print it. Stick it next to your screen. Run through it before pasting anything into an AI tool.'),
    'module-12.html': ('Module 12 - The standards behind this course', 'Plain-English summary of GDPR, EU AI Act, ISO 27001, ISO 42001.'),
    'module-manager.html': ('Manager Track - Approving AI-assisted work', 'For anyone who signs off on AI-assisted work. Meaningful human oversight under Article 14.'),
    'module-dpo.html': ('DPO Track - AI through the compliance lens', 'For DPOs and compliance leads. DPIA + FRIA, 72-hour clock, 90-day plan.'),
}

def breadcrumbs(path):
    items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": BASE + "/"}]
    p = path.name
    parts = str(path).replace(SEP, '/').lstrip('./').split('/')
    if len(parts) == 1 and p != 'index.html':
        if p in MODULE_META or p == 'standards-map.html':
            items.append({"@type": "ListItem", "position": 2, "name": "Course", "item": BASE + "/course.html"})
            page_title = MODULE_META.get(p, ('Standards Map', ''))[0] if p in MODULE_META else 'Standards Map'
            items.append({"@type": "ListItem", "position": 3, "name": page_title, "item": BASE + "/" + p})
        else:
            tm = re.search(r'<title>([^<]+?)(?: - AI Safe@Work)?</title>', path.read_text(encoding='utf-8'))
            items.append({"@type": "ListItem", "position": 2, "name": tm.group(1).strip() if tm else p, "item": BASE + "/" + p})
    elif len(parts) > 1:
        items.append({"@type": "ListItem", "position": 2, "name": "Templates", "item": BASE + "/" + parts[0] + "/"})
        tm = re.search(r'<title>([^<]+?)(?: - AI Safe@Work)?</title>', path.read_text(encoding='utf-8'))
        items.append({"@type": "ListItem", "position": 3, "name": tm.group(1).strip() if tm else parts[-1], "item": BASE + "/" + '/'.join(parts)})
    return {"@type": "BreadcrumbList", "itemListElement": items}

def schema_for(path):
    name = path.name
    url = BASE + "/" + str(path).replace(SEP, '/').lstrip('./')
    if name == 'index.html':
        return {"@context":"https://schema.org","@graph":[
            ORG, WEBSITE,
            {"@type":"Course","@id":f"{BASE}/course.html#course","name":"AI Safe@Work",
             "description":"A 12-module practical course on AI safety for non-technical SMB staff. Includes 2 role tracks, 2 ship-ready templates, and a standards map.",
             "url":BASE+"/course.html","provider":{"@id":f"{BASE}/#organization"},
             "inLanguage":"en","educationalLevel":"Beginner to intermediate",
             "audience":{"@type":"EducationalAudience","educationalRole":"SMB employee using AI tools at work"},
             "isAccessibleForFree":True,"timeRequired":"PT90M",
             "hasCourseInstance":{"@type":"CourseInstance","courseMode":"Online","courseWorkload":"PT90M","inLanguage":"en"},
             "teaches":["AI literacy under EU AI Act Article 4","Data protection in AI use","Spotting AI-powered scams","Verifying AI output","ISO/IEC 42001 and 27001 alignment"]}
        ]}
    if name == 'course.html':
        return {"@context":"https://schema.org","@graph":[ORG, WEBSITE,
            {"@type":"Course","@id":f"{BASE}/course.html#course","name":"AI Safe@Work - the full course",
             "description":"12 universal modules, 2 role tracks, 2 templates, a standards map. About 90 minutes for the core.",
             "url":BASE+"/course.html","provider":{"@id":f"{BASE}/#organization"},
             "inLanguage":"en","isAccessibleForFree":True,"timeRequired":"PT90M",
             "hasCourseInstance":{"@type":"CourseInstance","courseMode":"Online","courseWorkload":"PT90M","inLanguage":"en"}},
            breadcrumbs(path)
        ]}
    if name == 'standards-map.html':
        return {"@context":"https://schema.org","@graph":[
            {"@type":"Article","headline":"Standards Map - AI Safe@Work",
             "description":"Clause-by-clause mapping of EU AI Act, ISO/IEC 42001, ISO/IEC 27001, GDPR, NIST AI RMF, OWASP LLM Top 10 to the course modules.",
             "url":url,"publisher":{"@id":f"{BASE}/#organization"},
             "dateModified":"2026-05-19","datePublished":"2026-05-19","inLanguage":"en"},
            breadcrumbs(path)
        ]}
    if name == 'citations.html':
        return {"@context":"https://schema.org","@graph":[
            {"@type":"Article","headline":"Citations - AI Safe@Work",
             "description":"Every claim mapped to its primary source with confidence flag.",
             "url":url,"publisher":{"@id":f"{BASE}/#organization"},
             "dateModified":"2026-05-19","datePublished":"2026-05-19","inLanguage":"en"},
            breadcrumbs(path)
        ]}
    if name == 'changelog.html':
        return {"@context":"https://schema.org","@graph":[
            {"@type":"Article","headline":"Changelog - AI Safe@Work",
             "description":"Public release notes; quarterly cadence.",
             "url":url,"publisher":{"@id":f"{BASE}/#organization"},
             "dateModified":"2026-05-19","datePublished":"2026-05-19","inLanguage":"en"},
            breadcrumbs(path)
        ]}
    if name in MODULE_META:
        title, desc = MODULE_META[name]
        is_howto = name in ('module-11.html', 'module-10.html')
        kind = "HowTo" if is_howto else "LearningResource"
        return {"@context":"https://schema.org","@graph":[
            {"@type":kind,"@id":url+"#resource","name":title,"description":desc,"url":url,
             "learningResourceType":"Checklist" if is_howto else "Module",
             "inLanguage":"en","educationalLevel":"Beginner to intermediate",
             "isPartOf":{"@type":"Course","@id":f"{BASE}/course.html#course"},
             "audience":{"@type":"EducationalAudience","educationalRole":"SMB employee using AI tools at work"}},
            breadcrumbs(path)
        ]}
    if 'templates/aup-template' in str(path).replace(SEP, '/'):
        return {"@context":"https://schema.org","@graph":[
            {"@type":"HowTo","name":"Acceptable Use Policy template","description":"Starter AUP for AI tools at work; edit the bracketed fields and ship.",
             "url":url,"inLanguage":"en","publisher":{"@id":f"{BASE}/#organization"},
             "totalTime":"PT45M","dateModified":"2026-05-19"},
            breadcrumbs(path)
        ]}
    if 'templates/vendor-questionnaire' in str(path).replace(SEP, '/'):
        return {"@context":"https://schema.org","@graph":[
            {"@type":"HowTo","name":"AI vendor diligence questionnaire","description":"37-question diligence questionnaire to send to any AI vendor before procurement.",
             "url":url,"inLanguage":"en","publisher":{"@id":f"{BASE}/#organization"},
             "totalTime":"PT45M","dateModified":"2026-05-19"},
            breadcrumbs(path)
        ]}
    if name in ('privacy.html','terms.html','accessibility.html','complaints.html'):
        return {"@context":"https://schema.org","@graph":[
            {"@type":"WebPage","name":Path(name).stem.title()+" - AI Safe@Work","url":url,
             "publisher":{"@id":f"{BASE}/#organization"},"inLanguage":"en"},
            breadcrumbs(path)
        ]}
    return None

root = Path('.')
files = list(root.glob('*.html')) + list((root/'templates').glob('*.html'))
updated = 0
skipped = 0
for f in files:
    html = f.read_text(encoding='utf-8')
    if 'application/ld+json' in html and 'AI Safe@Work' in html:
        skipped += 1
        print('  . ' + str(f))
        continue
    sch = schema_for(f)
    if sch is None:
        print('  ! ' + str(f) + ' no rule')
        continue
    block = '<script type="application/ld+json">\n' + json.dumps(sch, indent=2) + '\n</script>\n'
    if '</head>' not in html:
        print('  ! ' + str(f) + ' no </head>')
        continue
    new_html = html.replace('</head>', block + '</head>', 1)
    f.write_text(new_html, encoding='utf-8')
    updated += 1
    print('  + ' + str(f))

print('updated:', updated, 'skipped:', skipped, 'total:', len(files))
