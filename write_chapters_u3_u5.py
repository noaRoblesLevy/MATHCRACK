import json, os
out = r'C:\Users\noaro\MATHCRACK\src\content\reading'

chapters = [
# ── UNIT 3 remaining ──────────────────────────────────────────────────
('ch-14-percent.json', {'id':'ch-14','chapterNumber':14,'unit':3,'unitTitle':'Ratios, Proportions & Percent','title':'Percent','pages':'98-106','blocks':[
  {'type':'definition','term':'Percent','body':'Percent means "per hundred." The symbol % represents hundredths. 45% means 45 out of 100, or 45/100 = 0.45.'},
  {'type':'rule','body':'Converting percent to decimal: move the decimal point two places LEFT (divide by 100). Example: 35% = 0.35, 7% = 0.07, 150% = 1.50.'},
  {'type':'rule','body':'Converting decimal to percent: move the decimal point two places RIGHT (multiply by 100). Example: 0.6 = 60%, 0.025 = 2.5%, 1.3 = 130%.'},
  {'type':'rule','body':'Converting percent to fraction: write the percent over 100 and simplify. Example: 25% = 25/100 = 1/4. 60% = 60/100 = 3/5.'},
  {'type':'heading','text':'Finding a Percent of a Number'},
  {'type':'rule','body':'To find a percent of a number: convert the percent to a decimal, then multiply. Formula: Part = Percent x Whole. Example: 30% of 80 = 0.30 x 80 = 24.'},
  {'type':'example','label':'Example 1','body':'What is 15% of 200? 0.15 x 200 = 30.'},
  {'type':'example','label':'Example 2','body':'What is 8% of 45? 0.08 x 45 = 3.6.'},
  {'type':'note','body':'The three percent problems: (1) Find the part: Part = % x Whole. (2) Find the percent: % = Part / Whole. (3) Find the whole: Whole = Part / %.'},
]}),
('ch-15-percent_applications.json', {'id':'ch-15','chapterNumber':15,'unit':3,'unitTitle':'Ratios, Proportions & Percent','title':'Percent Applications','pages':'107-122','blocks':[
  {'type':'heading','text':'Finding What Percent One Number Is of Another'},
  {'type':'rule','body':'To find what percent A is of B: divide A by B, then multiply by 100. Formula: Percent = (Part / Whole) x 100. Example: 18 is what % of 72? (18/72) x 100 = 25%.'},
  {'type':'heading','text':'Finding the Whole When a Part and Percent Are Known'},
  {'type':'rule','body':'To find the whole: divide the part by the decimal form of the percent. Formula: Whole = Part / Percent. Example: 12 is 30% of what number? 12 / 0.30 = 40.'},
  {'type':'heading','text':'Percent Increase and Decrease'},
  {'type':'rule','body':'Percent increase = (New - Original) / Original x 100. Percent decrease = (Original - New) / Original x 100. Example: price goes from $40 to $50. Percent increase = (10/40) x 100 = 25%.'},
  {'type':'example','label':'Example','body':'A shirt costs $80 and is discounted 20%. Discount = 20% x $80 = $16. Sale price = $80 - $16 = $64.'},
  {'type':'heading','text':'Sales Tax and Tips'},
  {'type':'rule','body':'Total with tax = Original price x (1 + tax rate). Example: $50 item with 8% tax = $50 x 1.08 = $54. Tip: multiply the bill by the tip percent and add it on.'},
  {'type':'note','body':'A shortcut for discounts: multiply by (1 - discount rate). A 25% off item: multiply price by 0.75. For markups: multiply by (1 + markup rate).'},
]}),
('ch-16-simple_interest.json', {'id':'ch-16','chapterNumber':16,'unit':3,'unitTitle':'Ratios, Proportions & Percent','title':'Simple Interest','pages':'123-130','blocks':[
  {'type':'definition','term':'Simple Interest','body':'Interest calculated only on the original principal (not on previously earned interest). Formula: I = P x r x t, where I = interest earned, P = principal (initial amount), r = annual interest rate (as a decimal), t = time in years.'},
  {'type':'example','label':'Example 1','body':'You invest $500 at 4% annual interest for 3 years. I = 500 x 0.04 x 3 = $60. Total = $500 + $60 = $560.'},
  {'type':'example','label':'Example 2','body':'A loan of $1,200 at 6% for 2.5 years. I = 1200 x 0.06 x 2.5 = $180.'},
  {'type':'rule','body':'You can rearrange I = Prt to find any variable: P = I/(rt), r = I/(Pt), t = I/(Pr). Example: how long to earn $90 interest on $1000 at 3%? t = 90 / (1000 x 0.03) = 3 years.'},
  {'type':'note','body':'Always convert the interest rate to a decimal before using the formula. 5% = 0.05. Also make sure time is in years — 6 months = 0.5 years.'},
]}),
('ch-17-percent_rate_of_change.json', {'id':'ch-17','chapterNumber':17,'unit':3,'unitTitle':'Ratios, Proportions & Percent','title':'Percent Rate of Change','pages':'131-134','blocks':[
  {'type':'definition','term':'Percent Rate of Change','body':'How much a quantity increases or decreases, expressed as a percentage of the original value. Positive = percent increase. Negative = percent decrease.'},
  {'type':'rule','body':'Percent rate of change = ((New Value - Original Value) / Original Value) x 100. If the result is positive, it is a percent increase. If negative, it is a percent decrease.'},
  {'type':'example','label':'Example 1','body':'Population goes from 4,000 to 5,200. Change = 1,200. Rate = (1200/4000) x 100 = 30% increase.'},
  {'type':'example','label':'Example 2','body':'Stock price falls from $80 to $60. Change = -20. Rate = (-20/80) x 100 = -25%. This is a 25% decrease.'},
  {'type':'note','body':'Always use the ORIGINAL value as the denominator, not the new value. This is the most common mistake with percent change problems.'},
]}),
('ch-18-tables_and_ratios.json', {'id':'ch-18','chapterNumber':18,'unit':3,'unitTitle':'Ratios, Proportions & Percent','title':'Tables and Ratios','pages':'135-140','blocks':[
  {'type':'text','body':'Ratios can be read from tables of equivalent values. If a table shows a constant relationship between two quantities, you can use proportional reasoning to find missing values.'},
  {'type':'rule','body':'In a ratio table, all columns show equivalent ratios. Find the scale factor between a known column and the unknown column, then apply it. Example: if 3 items cost $12, the ratio is 3:12 = 1:4. 7 items cost 7 x 4 = $28.'},
  {'type':'example','label':'Example','body':'A car travels at a constant speed. In 2 hours it goes 90 miles. Complete the table for 5 hours. Rate = 90/2 = 45 mph. In 5 hours: 45 x 5 = 225 miles.'},
  {'type':'note','body':'A ratio table always represents a proportional relationship. When you plot the pairs (x, y) from a ratio table, the points always fall on a straight line through the origin (0, 0).'},
]}),
# ── UNIT 4 ────────────────────────────────────────────────────────────
('ch-19-exponents.json', {'id':'ch-19','chapterNumber':19,'unit':4,'unitTitle':'Exponents & Algebraic Expressions','title':'Exponents','pages':'142-148','blocks':[
  {'type':'definition','term':'Exponent','body':'An exponent tells how many times to multiply the base by itself. In b^n, b is the base and n is the exponent (or power). Example: 2^5 = 2 x 2 x 2 x 2 x 2 = 32.'},
  {'type':'heading','text':'Laws of Exponents'},
  {'type':'rule','body':'Product Rule: b^m x b^n = b^(m+n). When multiplying same bases, ADD exponents. Example: x^3 x x^4 = x^7.'},
  {'type':'rule','body':'Quotient Rule: b^m / b^n = b^(m-n). When dividing same bases, SUBTRACT exponents. Example: x^6 / x^2 = x^4.'},
  {'type':'rule','body':'Power Rule: (b^m)^n = b^(m x n). When raising a power to a power, MULTIPLY exponents. Example: (x^3)^4 = x^12.'},
  {'type':'rule','body':'Zero Exponent: b^0 = 1 for any b not equal to 0. Example: 7^0 = 1, x^0 = 1.'},
  {'type':'rule','body':'Negative Exponent: b^(-n) = 1/b^n. A negative exponent means take the reciprocal. Example: 2^(-3) = 1/2^3 = 1/8.'},
  {'type':'example','label':'Examples','body':'3^4 = 81. (2x^2)^3 = 8x^6. x^5 / x^2 = x^3. (ab)^3 = a^3 b^3.'},
]}),
('ch-20-scientific_notation.json', {'id':'ch-20','chapterNumber':20,'unit':4,'unitTitle':'Exponents & Algebraic Expressions','title':'Scientific Notation','pages':'149-154','blocks':[
  {'type':'definition','term':'Scientific Notation','body':'A way to write very large or very small numbers as a product of a number between 1 and 10, and a power of 10. Form: a x 10^n, where 1 <= a < 10. Example: 3,400,000 = 3.4 x 10^6.'},
  {'type':'rule','body':'To convert to scientific notation: move the decimal so one non-zero digit is to the left. Count moves = exponent. Move left = positive exponent (large number). Move right = negative exponent (small number). Example: 0.00045 = 4.5 x 10^(-4).'},
  {'type':'rule','body':'To convert from scientific notation to standard form: move the decimal in the direction indicated by the sign of the exponent. Positive exponent = move right. Example: 6.2 x 10^4 = 62,000.'},
  {'type':'example','label':'Examples','body':'93,000,000 = 9.3 x 10^7. 0.0000056 = 5.6 x 10^(-6). 2.4 x 10^3 = 2,400. 1.7 x 10^(-2) = 0.017.'},
  {'type':'note','body':'When multiplying in scientific notation: multiply the coefficients and add the exponents. (3 x 10^4)(2 x 10^5) = 6 x 10^9. If the result is not in proper form, adjust.'},
]}),
('ch-21-expressions.json', {'id':'ch-21','chapterNumber':21,'unit':4,'unitTitle':'Exponents & Algebraic Expressions','title':'Expressions','pages':'155-162','blocks':[
  {'type':'definition','term':'Variable','body':'A letter that represents an unknown number. Examples: x, y, n, a.'},
  {'type':'definition','term':'Algebraic Expression','body':'A combination of numbers, variables, and operations — but NO equal sign. Examples: 3x + 5, 2a - 7, x^2 + 3x - 1.'},
  {'type':'definition','term':'Term','body':'A single number, variable, or product of numbers and variables. In 3x + 5 - 2y, the terms are 3x, 5, and -2y. The coefficient of 3x is 3.'},
  {'type':'definition','term':'Constant','body':'A term with no variable. It has a fixed value. In 3x + 7, the constant is 7.'},
  {'type':'rule','body':'Writing expressions from words: "sum" = +, "difference" = -, "product" = x, "quotient" = /. "5 more than a number" = n + 5. "Twice a number decreased by 3" = 2n - 3. "The product of 4 and a number" = 4n.'},
  {'type':'example','label':'Examples','body':'"A number divided by 6" = n/6. "Three times the sum of x and 4" = 3(x + 4). "8 less than twice a number" = 2n - 8.'},
]}),
('ch-22-evaluating_expressions.json', {'id':'ch-22','chapterNumber':22,'unit':4,'unitTitle':'Exponents & Algebraic Expressions','title':'Evaluating Algebraic Expressions','pages':'163-168','blocks':[
  {'type':'text','body':'Evaluating an expression means substituting given values for the variables and calculating the result using the order of operations (PEMDAS).'},
  {'type':'rule','body':'Steps: (1) Write the expression. (2) Substitute the given value(s) for each variable. (3) Simplify using PEMDAS.'},
  {'type':'example','label':'Example 1','body':'Evaluate 3x + 7 when x = 4. Substitute: 3(4) + 7 = 12 + 7 = 19.'},
  {'type':'example','label':'Example 2','body':'Evaluate 2a^2 - 3b when a = 3 and b = -2. Substitute: 2(3)^2 - 3(-2) = 2(9) + 6 = 18 + 6 = 24.'},
  {'type':'example','label':'Example 3','body':'Evaluate (x + y)^2 when x = 5 and y = -1. Substitute: (5 + (-1))^2 = (4)^2 = 16.'},
  {'type':'note','body':'Always use parentheses when substituting negative numbers to avoid sign errors. Write -3 as (-3), not just -3.'},
]}),
('ch-23-combining_like_terms.json', {'id':'ch-23','chapterNumber':23,'unit':4,'unitTitle':'Exponents & Algebraic Expressions','title':'Combining Like Terms','pages':'169-174','blocks':[
  {'type':'definition','term':'Like Terms','body':'Terms that have the same variable(s) raised to the same power(s). Examples: 3x and 7x are like terms. 4x^2 and -2x^2 are like terms. 3x and 3x^2 are NOT like terms (different powers).'},
  {'type':'rule','body':'To combine like terms: add or subtract their coefficients and keep the variable part the same. Example: 5x + 3x = 8x. 7y^2 - 2y^2 = 5y^2.'},
  {'type':'example','label':'Example 1','body':'Simplify: 4x + 3y - 2x + 5y. Group like terms: (4x - 2x) + (3y + 5y) = 2x + 8y.'},
  {'type':'example','label':'Example 2','body':'Simplify: 3x^2 + 5x - x^2 + 2x - 7. Combine: (3x^2 - x^2) + (5x + 2x) - 7 = 2x^2 + 7x - 7.'},
  {'type':'note','body':'Only like terms can be combined. You cannot add 3x and 4x^2 — they have different exponents. You also cannot add 3x and 3y — they have different variables.'},
]}),
# ── UNIT 5 ────────────────────────────────────────────────────────────
('ch-24-introduction_to_equations.json', {'id':'ch-24','chapterNumber':24,'unit':5,'unitTitle':'Linear Equations & Inequalities','title':'Introduction to Equations','pages':'176-184','blocks':[
  {'type':'definition','term':'Equation','body':'A mathematical statement that two expressions are equal, shown with an "=" sign. Example: 2x + 3 = 11. The goal is to find the value of the variable that makes it true.'},
  {'type':'definition','term':'Solution','body':'The value of the variable that makes the equation true. To check: substitute the value back in and verify both sides are equal.'},
  {'type':'rule','body':'Properties of Equality: whatever you do to one side of an equation, you must do to the other. Addition, subtraction, multiplication, and division all preserve equality.'},
  {'type':'rule','body':'To isolate the variable, use inverse operations: addition undoes subtraction, multiplication undoes division. Work backwards from the variable — undo the last operation first.'},
  {'type':'example','label':'Example 1','body':'x + 8 = 15. Subtract 8 from both sides: x = 7. Check: 7 + 8 = 15. True.'},
  {'type':'example','label':'Example 2','body':'3x = 21. Divide both sides by 3: x = 7. Check: 3(7) = 21. True.'},
  {'type':'note','body':'An equation with no solution (like 0 = 5) is called a contradiction. An equation that is always true (like 0 = 0 after simplification) is an identity — every number is a solution.'},
]}),
('ch-25-solving_one_variable_equations.json', {'id':'ch-25','chapterNumber':25,'unit':5,'unitTitle':'Linear Equations & Inequalities','title':'Solving One-Variable Equations','pages':'185-194','blocks':[
  {'type':'heading','text':'Two-Step Equations'},
  {'type':'rule','body':'Two-step equations require two operations to solve. Order: first undo addition/subtraction, then undo multiplication/division. Example: 2x - 3 = 11. Step 1: add 3 -> 2x = 14. Step 2: divide by 2 -> x = 7.'},
  {'type':'example','label':'Example 1','body':'5x + 4 = 29. Subtract 4: 5x = 25. Divide by 5: x = 5. Check: 5(5) + 4 = 29. True.'},
  {'type':'heading','text':'Multi-Step Equations'},
  {'type':'rule','body':'Steps: (1) Distribute if needed. (2) Combine like terms on each side. (3) Move variable terms to one side. (4) Isolate the variable.'},
  {'type':'example','label':'Example 2','body':'3(x + 2) = 2x + 11. Distribute: 3x + 6 = 2x + 11. Subtract 2x: x + 6 = 11. Subtract 6: x = 5.'},
  {'type':'example','label':'Example 3','body':'4x - 7 = 2x + 9. Subtract 2x: 2x - 7 = 9. Add 7: 2x = 16. Divide by 2: x = 8.'},
  {'type':'note','body':'Always check your answer by substituting it back into the ORIGINAL equation (not a simplified version), to catch any errors made during solving.'},
]}),
('ch-26-solving_inequalities.json', {'id':'ch-26','chapterNumber':26,'unit':5,'unitTitle':'Linear Equations & Inequalities','title':'Solving One-Variable Inequalities','pages':'195-205','blocks':[
  {'type':'definition','term':'Inequality','body':'A statement that two expressions are not equal — one is greater or less than the other. Symbols: > (greater than), < (less than), >= (greater than or equal to), <= (less than or equal to).'},
  {'type':'rule','body':'Solve inequalities like equations, with ONE key exception: when you multiply or divide both sides by a NEGATIVE number, FLIP the inequality sign. Example: -2x > 6. Divide by -2 and flip: x < -3.'},
  {'type':'example','label':'Example 1','body':'3x + 5 > 14. Subtract 5: 3x > 9. Divide by 3: x > 3. Solution: all numbers greater than 3.'},
  {'type':'example','label':'Example 2','body':'-4x <= 20. Divide by -4 and FLIP sign: x >= -5.'},
  {'type':'rule','body':'Graphing on a number line: open circle (o) for > or < (does not include the endpoint). Closed circle (•) for >= or <= (includes the endpoint). Shade the direction of solutions.'},
  {'type':'note','body':'The solution to an inequality is a range of values, not a single value. "x > 3" means infinitely many solutions: 4, 5, 3.1, 1000, etc.'},
]}),
('ch-27-compound_inequalities.json', {'id':'ch-27','chapterNumber':27,'unit':5,'unitTitle':'Linear Equations & Inequalities','title':'Solving Compound Inequalities','pages':'206-218','blocks':[
  {'type':'definition','term':'Compound Inequality','body':'Two inequalities joined by "and" or "or." AND means both must be true (intersection). OR means at least one must be true (union).'},
  {'type':'heading','text':'AND Inequalities (Conjunction)'},
  {'type':'rule','body':'"And" inequalities can be written as a three-part inequality: a < x < b. Solve by applying the same operation to ALL THREE parts simultaneously. Example: -3 < 2x + 1 < 9. Subtract 1 from all parts: -4 < 2x < 8. Divide by 2: -2 < x < 4.'},
  {'type':'example','label':'Example','body':'Solve and graph: -1 <= 3x - 2 <= 10. Add 2: 1 <= 3x <= 12. Divide by 3: 1/3 <= x <= 4.'},
  {'type':'heading','text':'OR Inequalities (Disjunction)'},
  {'type':'rule','body':'"Or" inequalities: solve each inequality separately. The solution includes ALL values that satisfy either one. Example: x < -2 or x > 5. Graph shows two rays pointing outward.'},
  {'type':'note','body':'AND = overlap (more restrictive). OR = union (more inclusive). If an AND compound inequality has no overlap, there is no solution. If an OR covers everything, all real numbers is the solution.'},
]}),
('ch-28-rewriting_formulas.json', {'id':'ch-28','chapterNumber':28,'unit':5,'unitTitle':'Linear Equations & Inequalities','title':'Rewriting Formulas','pages':'219-224','blocks':[
  {'type':'text','body':'Many real-world formulas have multiple variables. You can solve for any one variable by treating the others as constants and using algebra.'},
  {'type':'rule','body':'To solve a formula for a specific variable: isolate that variable on one side using the same steps as solving an equation. Example: solve d = rt for t. Divide both sides by r: t = d/r.'},
  {'type':'example','label':'Example 1','body':'Solve A = (1/2)bh for h. Multiply both sides by 2: 2A = bh. Divide by b: h = 2A/b.'},
  {'type':'example','label':'Example 2','body':'Solve P = 2l + 2w for w. Subtract 2l: P - 2l = 2w. Divide by 2: w = (P - 2l)/2.'},
  {'type':'example','label':'Example 3','body':'Solve C = (5/9)(F - 32) for F. Multiply by 9/5: (9/5)C = F - 32. Add 32: F = (9/5)C + 32.'},
  {'type':'note','body':'This skill is essential in science: rearranging V = IR for R, or E = mc^2 for m. The process is identical to solving any equation.'},
]}),
('ch-29-systems_substitution.json', {'id':'ch-29','chapterNumber':29,'unit':5,'unitTitle':'Linear Equations & Inequalities','title':'Systems by Substitution','pages':'225-236','blocks':[
  {'type':'definition','term':'System of Linear Equations','body':'Two or more linear equations with the same variables. The solution is the set of values that satisfies ALL equations simultaneously — the point where the lines intersect.'},
  {'type':'rule','body':'Substitution Method: (1) Solve one equation for one variable. (2) Substitute that expression into the other equation. (3) Solve for the remaining variable. (4) Substitute back to find the first variable. (5) Check both original equations.'},
  {'type':'example','label':'Example','body':'Solve: y = 2x + 1 and 3x + y = 16. Substitute y = 2x + 1 into 3x + y = 16: 3x + (2x + 1) = 16. 5x + 1 = 16. 5x = 15. x = 3. Then y = 2(3) + 1 = 7. Solution: (3, 7).'},
  {'type':'rule','body':'Types of solutions: One solution (lines intersect at one point). No solution (parallel lines — equations are inconsistent). Infinitely many solutions (same line — equations are dependent).'},
  {'type':'note','body':'Substitution works best when one variable has a coefficient of 1 and is easy to isolate. If neither variable is easy to isolate, use elimination instead.'},
]}),
('ch-30-systems_elimination.json', {'id':'ch-30','chapterNumber':30,'unit':5,'unitTitle':'Linear Equations & Inequalities','title':'Systems by Elimination','pages':'237-246','blocks':[
  {'type':'rule','body':'Elimination Method: (1) Line up equations. (2) Multiply one or both equations so one variable has opposite coefficients. (3) Add the equations to eliminate that variable. (4) Solve for the remaining variable. (5) Substitute back to find the eliminated variable.'},
  {'type':'example','label':'Example 1','body':'Solve: 2x + 3y = 12 and 2x - y = 4. Subtract: (2x + 3y) - (2x - y) = 12 - 4. 4y = 8. y = 2. Then 2x + 6 = 12, 2x = 6, x = 3. Solution: (3, 2).'},
  {'type':'example','label':'Example 2','body':'Solve: 3x + 2y = 16 and 5x - 4y = 8. Multiply first equation by 2: 6x + 4y = 32. Add to second: 11x = 40. x = 40/11... multiply first by 2 to get 4y terms to cancel.'},
  {'type':'note','body':'Choose elimination when both equations are in standard form (Ax + By = C). Choose substitution when one variable is already isolated. Both methods give the same answer.'},
]}),
]

for fname, data in chapters:
    path = os.path.join(out, fname)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f'  {fname}: {len(data["blocks"])} blocks')
print('Done.')
