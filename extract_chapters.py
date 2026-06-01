import fitz, json, re, os

doc = fitz.open(r'C:\Users\noaro\QUANT\book_pdfs\EverythingYouNeedAcePreAlgebraAlgebraWang.pdf')
out = r'C:\Users\noaro\MATHCRACK\src\content\reading'
os.makedirs(out, exist_ok=True)

CHAPTERS = [
  (1, 1, "Arithmetic Properties",          "Types of Numbers",                    13, 21, "2-8"),
  (2, 1, "Arithmetic Properties",          "Algebraic Properties",                21, 29, "9-16"),
  (3, 1, "Arithmetic Properties",          "Order of Operations",                 29, 36, "17-23"),
  (4, 2, "The Number System",              "Adding Integers",                     36, 45, "24-31"),
  (5, 2, "The Number System",              "Subtracting Integers",                45, 51, "32-38"),
  (6, 2, "The Number System",              "Multiplying & Dividing Integers",     51, 56, "37-44"),
  (7, 2, "The Number System",              "Multiplying & Dividing Fractions",    56, 64, "43-50"),
  (8, 2, "The Number System",              "Adding & Subtracting Fractions",      64, 73, "51-57"),
  (9, 2, "The Number System",              "Adding & Subtracting Decimals",       73, 80, "59-66"),
  (10,2, "The Number System",              "Multiplying & Dividing Decimals",     80, 87, "67-74"),
  (11,3, "Ratios, Proportions & Percent",  "Ratio",                               87, 95, "76-82"),
  (12,3, "Ratios, Proportions & Percent",  "Unit Rate",                           95, 102,"83-88"),
  (13,3, "Ratios, Proportions & Percent",  "Proportion",                          102,110,"89-97"),
]

def get_main_text(page_idx):
    """Extract only large text blocks from the page (skips floating captions/decorations)."""
    page = doc[page_idx]
    w, h = page.rect.width, page.rect.height
    blocks = page.get_text("blocks")  # (x0,y0,x1,y1,text,block_no,block_type)

    lines = []
    for b in blocks:
        x0, y0, x1, y1, text, block_no, block_type = b
        if block_type != 0:  # skip image blocks
            continue
        text = text.strip()
        if not text:
            continue
        block_w = x1 - x0
        block_h = y1 - y0
        # Skip very narrow blocks (sidebar captions, annotations)
        if block_w < w * 0.25:
            continue
        # Skip tiny height blocks (single decorative chars)
        if block_h < 10:
            continue
        # Skip blocks on far right margin (decorative text)
        if x0 > w * 0.75:
            continue
        lines.append(text)

    return '\n'.join(lines)

def clean(text):
    # Remove standalone page numbers
    text = re.sub(r'(?m)^\d{1,3}$', '', text)
    # Dedup adjacent repeated phrases
    text = re.sub(r'(.{10,60})\n\1', r'\1', text)
    text = re.sub(r'(.{10,50}) \1', r'\1', text)
    # Collapse excessive newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def classify_block(text):
    t = text.strip()
    first_line = t.split('\n')[0].strip()

    # ALL CAPS definition term
    if re.match(r'^[A-Z][A-Z\s\-]{3,}[A-Z]:?\s*$', first_line) and len(first_line) < 70:
        rest = '\n'.join(t.split('\n')[1:]).strip()
        return ('definition', first_line.rstrip(':').title(), rest or None)

    # Example block
    if re.match(r'^Examples?:?\s*$', first_line, re.I) or first_line.lower().startswith('example:'):
        body = t.split(':', 1)[-1].strip() if ':' in first_line else ''
        rest = '\n'.join(t.split('\n')[1:]).strip()
        combined = (body + ' ' + rest).strip()
        return ('example', None, combined)

    # Note / Think / Remember
    m = re.match(r'^(Note|Think|Remember|Tip|Key):?\s*(.*)', t, re.I | re.S)
    if m:
        body = m.group(2).strip().replace('\n', ' ')
        return ('note', None, body)

    # Rule: mentions "states that" or "property of"
    flat = t.replace('\n', ' ')
    if re.search(r'\bstates that\b|\bthe property\b', flat, re.I) and len(flat) > 50:
        flat = re.sub(r'(.{10,40}) \1', r'\1', flat)
        return ('rule', None, flat)

    # Regular paragraph
    flat = t.replace('\n', ' ')
    flat = re.sub(r'(.{10,40}) \1', r'\1', flat)
    if len(flat) > 12:
        return ('text', None, flat)

    return None

def parse(chapter_pages):
    raw_parts = [get_main_text(p) for p in chapter_pages]
    raw = '\n\n'.join(raw_parts)
    raw = clean(raw)

    paragraphs = re.split(r'\n\n+', raw)
    blocks = []
    seen = set()

    for para in paragraphs:
        para = para.strip()
        if not para or len(para) < 8:
            continue

        result = classify_block(para)
        if not result:
            continue

        btype, term, body = result
        if body:
            body = body.strip()

        # Skip if body is too short or garbage
        if not body or len(body) < 8:
            continue

        # Dedup
        key = body[:60]
        if key in seen:
            continue
        seen.add(key)

        if btype == 'definition':
            blocks.append({'type': 'definition', 'term': term, 'body': body})
        elif btype == 'example':
            blocks.append({'type': 'example', 'label': 'Example', 'body': body})
        elif btype == 'note':
            blocks.append({'type': 'note', 'body': body})
        elif btype == 'rule':
            blocks.append({'type': 'rule', 'body': body})
        else:
            blocks.append({'type': 'text', 'body': body})

    return blocks


index_units = {}

for (num, unit, unit_title, title, start, end, pages) in CHAPTERS:
    blocks = parse(range(start, end))

    chapter = {
        'id': f'ch-{num:02d}',
        'chapterNumber': num,
        'unit': unit,
        'unitTitle': unit_title,
        'title': title,
        'pages': pages,
        'blocks': blocks,
    }

    slug = title.lower().replace(' & ', '_').replace(' ', '_').replace('/', '_')
    fname = f'ch-{num:02d}-{slug}.json'
    with open(os.path.join(out, fname), 'w', encoding='utf-8') as f:
        json.dump(chapter, f, indent=2, ensure_ascii=False)
    print(f'  {fname}: {len(blocks)} blocks')

    if unit not in index_units:
        index_units[unit] = {'number': unit, 'title': unit_title, 'chapters': []}
    index_units[unit]['chapters'].append(f'ch-{num:02d}')

index = [{
    'id': 'wang-algebra',
    'title': 'Pre-Algebra & Algebra 1',
    'author': 'Jason Wang',
    'description': 'Clear notes on every key concept — definitions, rules, and worked examples.',
    'icon': '📗',
    'color': '#34d399',
    'units': list(index_units.values()),
}]
with open(os.path.join(out, 'index.json'), 'w', encoding='utf-8') as f:
    json.dump(index, f, indent=2, ensure_ascii=False)
print('Done.')
