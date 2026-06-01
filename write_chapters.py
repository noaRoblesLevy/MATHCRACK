import json, os

out = r'C:\Users\noaro\MATHCRACK\src\content\reading'
os.makedirs(out, exist_ok=True)

chapters = [
  ('ch-03-order_of_operations.json', {
    'id':'ch-03','chapterNumber':3,'unit':1,'unitTitle':'Arithmetic Properties','title':'Order of Operations','pages':'17-23',
    'blocks':[
      {'type':'text','body':'When an expression has multiple operations, follow a strict order or you will get the wrong answer. The memory trick is PEMDAS.'},
      {'type':'definition','term':'PEMDAS','body':'Parentheses first, then Exponents, then Multiplication and Division (left to right), then Addition and Subtraction (left to right). Also remembered as: Please Excuse My Dear Aunt Sally.'},
      {'type':'rule','body':'Step 1 - Parentheses: simplify everything inside brackets first. Step 2 - Exponents: evaluate powers and roots. Step 3 - Multiply/Divide: work left to right. Step 4 - Add/Subtract: work left to right.'},
      {'type':'example','label':'Example 1','body':'2 + 3 x 4 = 2 + 12 = 14. Multiplication happens before addition. (NOT 5 x 4 = 20.)'},
      {'type':'example','label':'Example 2','body':'(2 + 3) x 4 = 5 x 4 = 20. Parentheses change the order - add first, then multiply.'},
      {'type':'example','label':'Example 3','body':'2^2 + 4 / 2 - 1 = 4 + 2 - 1 = 5. Exponent first, then division, then subtract.'},
      {'type':'example','label':'Example 4','body':'3 + 4 x (6 - 2)^2 / 8 = 3 + 4 x 16 / 8 = 3 + 8 = 11.'},
      {'type':'note','body':'Multiplication and division have equal priority - do whichever comes first LEFT to RIGHT. Never do all multiplication before all division.'},
    ]
  }),
  ('ch-04-adding_integers.json', {
    'id':'ch-04','chapterNumber':4,'unit':2,'unitTitle':'The Number System','title':'Adding Integers','pages':'24-31',
    'blocks':[
      {'type':'text','body':'Integers include all whole numbers and their negatives. Adding them requires attention to sign.'},
      {'type':'definition','term':'Absolute Value','body':'The distance of a number from zero on the number line. Always non-negative. Written |n|. Examples: |5| = 5, |-5| = 5, |0| = 0.'},
      {'type':'rule','body':'Same Sign Rule: When adding two numbers with the same sign, add the absolute values and keep the sign. Examples: 4 + 6 = 10, (-4) + (-6) = -10.'},
      {'type':'rule','body':'Different Sign Rule: When adding numbers with different signs, subtract the smaller absolute value from the larger, and keep the sign of the number with the larger absolute value. Example: -8 + 3 = -5 (because |-8| > |3|, keep the negative).'},
      {'type':'example','label':'Example 1','body':'-5 + (-3): same signs (both negative) -> add absolute values: 5 + 3 = 8 -> answer is -8.'},
      {'type':'example','label':'Example 2','body':'7 + (-10): different signs -> |10| > |7| -> subtract: 10 - 7 = 3 -> keep negative sign -> -3.'},
      {'type':'example','label':'Example 3','body':'-4 + 9: different signs -> |9| > |4| -> subtract: 9 - 4 = 5 -> keep positive sign -> 5.'},
      {'type':'note','body':'Think of a number line: positive means move right, negative means move left. Adding a negative is the same as moving left.'},
    ]
  }),
  ('ch-05-subtracting_integers.json', {
    'id':'ch-05','chapterNumber':5,'unit':2,'unitTitle':'The Number System','title':'Subtracting Integers','pages':'32-38',
    'blocks':[
      {'type':'rule','body':'Key Rule: Subtracting an integer is the same as adding its opposite. a - b = a + (-b). Always convert subtraction to addition of the opposite, then use the addition rules.'},
      {'type':'example','label':'Example 1','body':'7 - 3 = 7 + (-3) = 4.'},
      {'type':'example','label':'Example 2','body':'7 - (-3) = 7 + 3 = 10. Subtracting a negative is the same as adding a positive.'},
      {'type':'example','label':'Example 3','body':'-5 - 4 = -5 + (-4) = -9. Both negative, same sign -> add absolute values, keep negative.'},
      {'type':'example','label':'Example 4','body':'-2 - (-8) = -2 + 8 = 6.'},
      {'type':'note','body':'The phrase "keep, change, change" helps: KEEP the first number, CHANGE subtraction to addition, CHANGE the sign of the second number. Then use the addition rules.'},
    ]
  }),
  ('ch-06-multiplying_dividing_integers.json', {
    'id':'ch-06','chapterNumber':6,'unit':2,'unitTitle':'The Number System','title':'Multiplying & Dividing Integers','pages':'37-44',
    'blocks':[
      {'type':'rule','body':'Sign rules for multiplication and division: (+) x (+) = (+), (-) x (-) = (+), (+) x (-) = (-), (-) x (+) = (-). Same signs give a positive result; different signs give a negative result.'},
      {'type':'example','label':'Examples','body':'5 x 4 = 20. (-5) x (-4) = 20. 5 x (-4) = -20. (-5) x 4 = -20. 12 / 3 = 4. (-12) / (-3) = 4. 12 / (-3) = -4.'},
      {'type':'note','body':'An even number of negative signs in a product gives a positive result. An odd number of negatives gives a negative. Example: (-2) x (-3) x (-4) = -24 (three negatives = odd = negative).'},
      {'type':'rule','body':'Division follows the same sign rules as multiplication. Dividing by a number is the same as multiplying by its reciprocal, so the sign rules are identical.'},
    ]
  }),
  ('ch-07-multiplying_dividing_fractions.json', {
    'id':'ch-07','chapterNumber':7,'unit':2,'unitTitle':'The Number System','title':'Multiplying & Dividing Fractions','pages':'43-50',
    'blocks':[
      {'type':'heading','text':'Multiplying Fractions'},
      {'type':'rule','body':'To multiply fractions: multiply the numerators together, then multiply the denominators together. (a/b) x (c/d) = (ac)/(bd). Always simplify the result.'},
      {'type':'example','label':'Example','body':'2/3 x 4/5 = 8/15. | 1/2 x 3/4 = 3/8.'},
      {'type':'note','body':'Cross-cancellation shortcut: before multiplying, cancel common factors diagonally. Example: 4/9 x 3/8 - cancel 4 and 8 (divide by 4), cancel 3 and 9 (divide by 3) -> 1/3 x 1/2 = 1/6.'},
      {'type':'heading','text':'Dividing Fractions'},
      {'type':'rule','body':'To divide fractions, use KCF: Keep the first fraction, Change division to multiplication, Flip the second fraction (use its reciprocal). (a/b) / (c/d) = (a/b) x (d/c).'},
      {'type':'example','label':'Example','body':'3/4 / 2/5 = 3/4 x 5/2 = 15/8 = 1 and 7/8.'},
      {'type':'heading','text':'Mixed Numbers'},
      {'type':'rule','body':'Convert mixed numbers to improper fractions first, then multiply or divide. To convert: (whole number x denominator + numerator) / denominator. Example: 2 and 1/3 = 7/3.'},
      {'type':'example','label':'Example','body':'1 and 1/2 x 2 and 2/3 = 3/2 x 8/3 = 24/6 = 4.'},
    ]
  }),
  ('ch-08-adding_subtracting_fractions.json', {
    'id':'ch-08','chapterNumber':8,'unit':2,'unitTitle':'The Number System','title':'Adding & Subtracting Fractions','pages':'51-57',
    'blocks':[
      {'type':'rule','body':'To add or subtract fractions they must share a common denominator. If they already do, add or subtract the numerators and keep the denominator. Example: 3/8 + 1/8 = 4/8 = 1/2.'},
      {'type':'definition','term':'Least Common Denominator (LCD)','body':'The smallest number that both denominators divide into evenly. Find it to add or subtract fractions with different denominators.'},
      {'type':'example','label':'Example 1','body':'1/4 + 1/6. LCD of 4 and 6 = 12. Convert: 1/4 = 3/12, 1/6 = 2/12. Add: 3/12 + 2/12 = 5/12.'},
      {'type':'example','label':'Example 2','body':'5/6 - 1/4. LCD = 12. Convert: 5/6 = 10/12, 1/4 = 3/12. Subtract: 10/12 - 3/12 = 7/12.'},
      {'type':'heading','text':'Adding Mixed Numbers'},
      {'type':'rule','body':'Add whole parts together. Add fraction parts together. If the fraction sum is improper, convert and carry. Example: 2 and 3/4 + 1 and 1/2 = 2 and 3/4 + 1 and 2/4 = 3 and 5/4 = 4 and 1/4.'},
      {'type':'heading','text':'Subtracting Mixed Numbers'},
      {'type':'rule','body':'Subtract fractions first. If the top fraction is smaller, borrow 1 from the whole number part. Example: 3 and 1/4 - 1 and 3/4. Borrow: 3 and 1/4 = 2 and 5/4. Then: 2 and 5/4 - 1 and 3/4 = 1 and 2/4 = 1 and 1/2.'},
      {'type':'note','body':'Always simplify your final answer. Divide numerator and denominator by their GCF. Example: 6/8 = 3/4.'},
    ]
  }),
  ('ch-09-adding_subtracting_decimals.json', {
    'id':'ch-09','chapterNumber':9,'unit':2,'unitTitle':'The Number System','title':'Adding & Subtracting Decimals','pages':'59-66',
    'blocks':[
      {'type':'rule','body':'To add or subtract decimals: line up the decimal points vertically, fill missing places with zeros, then add or subtract normally. Bring the decimal point straight down into the answer.'},
      {'type':'example','label':'Example 1','body':'3.25 + 1.7: write as 3.25 + 1.70, then add to get 4.95.'},
      {'type':'example','label':'Example 2','body':'5.3 - 2.48: write as 5.30 - 2.48 = 2.82. Fill in the zero so digits align.'},
      {'type':'example','label':'Example 3','body':'Add 0.5, 1.25, and 3: write 0.50 + 1.25 + 3.00 = 4.75.'},
      {'type':'note','body':'Lining up the decimal points ensures you add digits of the same place value - tenths with tenths, hundredths with hundredths, etc.'},
    ]
  }),
  ('ch-10-multiplying_dividing_decimals.json', {
    'id':'ch-10','chapterNumber':10,'unit':2,'unitTitle':'The Number System','title':'Multiplying & Dividing Decimals','pages':'67-74',
    'blocks':[
      {'type':'heading','text':'Multiplying Decimals'},
      {'type':'rule','body':'Multiply as if the decimal points do not exist. Count the total decimal places in both factors. Place the decimal point that many places from the right in the product.'},
      {'type':'example','label':'Example','body':'2.3 x 1.4: multiply 23 x 14 = 322. Total decimal places = 1 + 1 = 2. Answer: 3.22.'},
      {'type':'heading','text':'Dividing Decimals'},
      {'type':'rule','body':'To divide by a decimal: move the decimal in the divisor right to make it a whole number. Move the decimal in the dividend the same number of places right. Then divide normally.'},
      {'type':'example','label':'Example 1','body':'4.5 / 0.5 -> move both one place right -> 45 / 5 = 9.'},
      {'type':'example','label':'Example 2','body':'6.24 / 0.3 -> move both one place right -> 62.4 / 3 = 20.8.'},
      {'type':'note','body':'To divide a decimal by a whole number, divide normally and bring the decimal point straight up into the quotient. Example: 6.36 / 3 = 2.12.'},
    ]
  }),
  ('ch-11-ratio.json', {
    'id':'ch-11','chapterNumber':11,'unit':3,'unitTitle':'Ratios, Proportions & Percent','title':'Ratio','pages':'76-82',
    'blocks':[
      {'type':'definition','term':'Ratio','body':'A comparison of two quantities using division. Can be written three ways: "a to b", a:b, or a/b. Example: 3 apples and 5 oranges -> ratio of apples to oranges is 3:5.'},
      {'type':'note','body':'Order matters. The ratio of apples to oranges (3:5) is different from the ratio of oranges to apples (5:3).'},
      {'type':'rule','body':'Always simplify ratios to lowest terms by dividing both parts by their greatest common factor (GCF). Example: 6:9 = 2:3 (divided both by 3).'},
      {'type':'example','label':'Example 1','body':'A class has 14 boys and 16 girls. Ratio of boys to girls = 14:16 = 7:8. Ratio of girls to total = 16:30 = 8:15.'},
      {'type':'example','label':'Example 2','body':'Simplify 15:25. GCF = 5. Answer: 3:5.'},
      {'type':'note','body':'Ratios can compare part-to-part (boys:girls) or part-to-whole (boys:total students). Be clear about which type you are using.'},
    ]
  }),
  ('ch-12-unit_rate.json', {
    'id':'ch-12','chapterNumber':12,'unit':3,'unitTitle':'Ratios, Proportions & Percent','title':'Unit Rate','pages':'83-88',
    'blocks':[
      {'type':'definition','term':'Rate','body':'A ratio that compares two quantities with different units. Examples: miles per hour, dollars per pound, heartbeats per minute.'},
      {'type':'definition','term':'Unit Rate','body':'A rate where the second quantity is 1. To find a unit rate, divide the first quantity by the second. Example: 150 miles in 3 hours -> 150 / 3 = 50 miles per hour.'},
      {'type':'example','label':'Example 1','body':'A pack of 6 pens costs $4.50. Unit price = $4.50 / 6 = $0.75 per pen.'},
      {'type':'example','label':'Example 2','body':'A runner completes 400 meters in 50 seconds. Unit rate = 400 / 50 = 8 meters per second.'},
      {'type':'note','body':'Unit rates make comparisons easy. Brand A: $0.75/pen vs Brand B: $0.80/pen -> Brand A is a better deal.'},
      {'type':'rule','body':'To convert between rates, multiply by a conversion factor (a fraction equal to 1). Example: 60 miles/hour x (5280 feet/mile) = 316,800 feet/hour.'},
    ]
  }),
  ('ch-13-proportion.json', {
    'id':'ch-13','chapterNumber':13,'unit':3,'unitTitle':'Ratios, Proportions & Percent','title':'Proportion','pages':'89-97',
    'blocks':[
      {'type':'definition','term':'Proportion','body':'A statement that two ratios are equal: a/b = c/d. Example: 1/2 = 3/6 is a proportion because both equal 0.5.'},
      {'type':'rule','body':'Cross-Multiplication: If a/b = c/d, then a x d = b x c. This is the key tool for solving proportions. Cross multiply to eliminate fractions, then solve for the unknown.'},
      {'type':'example','label':'Example 1','body':'Solve: x/3 = 4/6. Cross multiply: 6x = 12. Divide by 6: x = 2.'},
      {'type':'example','label':'Example 2','body':'Solve: 5/8 = 15/x. Cross multiply: 5x = 120. Divide by 5: x = 24.'},
      {'type':'heading','text':'Using Proportions to Solve Problems'},
      {'type':'example','label':'Example 3','body':'If 4 apples cost $1.20, how much do 10 apples cost? Set up: 4/1.20 = 10/x. Cross multiply: 4x = 12. x = $3.00.'},
      {'type':'example','label':'Example 4','body':'Map scale: 1 inch = 50 miles. Two cities are 3.5 inches apart. Distance = ? Set up: 1/50 = 3.5/x -> x = 175 miles.'},
      {'type':'note','body':'Always label your proportion with units. Make sure you have the same type of quantity in the same position on both sides.'},
    ]
  }),
]

for fname, data in chapters:
    path = os.path.join(out, fname)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f'  {fname}: {len(data["blocks"])} blocks')
print('All done.')
