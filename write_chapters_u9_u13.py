import json, os
out = r'C:\Users\noaro\MATHCRACK\src\content\reading'

chapters = [
# ── UNIT 9 ────────────────────────────────────────────────────────────
('ch-48-adding_subtracting_polynomials.json', {'id':'ch-48','chapterNumber':48,'unit':9,'unitTitle':'Polynomial Operations','title':'Adding & Subtracting Polynomials','pages':'428-436','blocks':[
  {'type':'definition','term':'Polynomial','body':'An expression with one or more terms where variables have whole number exponents. Examples: 3x^2 + 2x - 5 (trinomial), 4x + 7 (binomial), 9 (monomial).'},
  {'type':'definition','term':'Degree of a Polynomial','body':'The highest exponent of the variable. Example: 3x^4 - 2x + 1 has degree 4. Standard form lists terms from highest to lowest degree.'},
  {'type':'rule','body':'Adding polynomials: combine like terms (same variable, same exponent). Remove parentheses, group like terms, simplify. Example: (3x^2 + 2x) + (x^2 - 5x + 4) = 4x^2 - 3x + 4.'},
  {'type':'rule','body':'Subtracting polynomials: distribute the negative sign (multiply all terms in the second polynomial by -1), then add. Example: (5x^2 + 3x) - (2x^2 - x + 6) = (5x^2 + 3x) + (-2x^2 + x - 6) = 3x^2 + 4x - 6.'},
  {'type':'example','label':'Example','body':'(4x^3 - 2x + 7) - (x^3 + 3x^2 - x + 2) = 4x^3 - 2x + 7 - x^3 - 3x^2 + x - 2 = 3x^3 - 3x^2 - x + 5.'},
]}),
('ch-49-multiplying_dividing_exponents.json', {'id':'ch-49','chapterNumber':49,'unit':9,'unitTitle':'Polynomial Operations','title':'Multiplying & Dividing Exponents','pages':'437-444','blocks':[
  {'type':'rule','body':'Product Rule: x^a x x^b = x^(a+b). Add exponents when multiplying like bases. Example: x^3 x x^5 = x^8.'},
  {'type':'rule','body':'Quotient Rule: x^a / x^b = x^(a-b). Subtract exponents when dividing like bases. Example: x^7 / x^3 = x^4.'},
  {'type':'rule','body':'Power of a Power: (x^a)^b = x^(ab). Multiply exponents. Example: (x^3)^4 = x^12.'},
  {'type':'rule','body':'Power of a Product: (xy)^n = x^n y^n. Apply the exponent to each factor. Example: (2x^2)^3 = 8x^6.'},
  {'type':'rule','body':'Power of a Quotient: (x/y)^n = x^n / y^n. Example: (a/b)^4 = a^4/b^4.'},
  {'type':'example','label':'Examples','body':'(3x^2)(4x^5) = 12x^7. (2a^3b)^2 = 4a^6b^2. 15x^8 / 5x^3 = 3x^5.'},
]}),
('ch-50-multiplying_monomials.json', {'id':'ch-50','chapterNumber':50,'unit':9,'unitTitle':'Polynomial Operations','title':'Multiplying & Dividing Monomials','pages':'445-452','blocks':[
  {'type':'definition','term':'Monomial','body':'A polynomial with exactly one term. Examples: 5, 3x, -2x^2y, 7ab^3.'},
  {'type':'rule','body':'To multiply monomials: multiply the coefficients, then multiply the variables using the product rule for exponents. Example: (4x^2y)(3xy^3) = 12x^3y^4.'},
  {'type':'rule','body':'To divide monomials: divide the coefficients, then divide variables using the quotient rule. Example: 12x^5y^3 / 4x^2y = 3x^3y^2.'},
  {'type':'example','label':'Example 1','body':'(-3a^2b)(5ab^4) = -15a^3b^5.'},
  {'type':'example','label':'Example 2','body':'24m^6n^3 / 8m^2n = 3m^4n^2.'},
  {'type':'note','body':'When the exponent result is negative, rewrite using the negative exponent rule: x^(-n) = 1/x^n. Example: x^2 / x^5 = x^(-3) = 1/x^3.'},
]}),
('ch-51-multiplying_polynomials.json', {'id':'ch-51','chapterNumber':51,'unit':9,'unitTitle':'Polynomial Operations','title':'Multiplying & Dividing Polynomials','pages':'453-460','blocks':[
  {'type':'rule','body':'Multiplying a polynomial by a monomial: distribute (multiply the monomial by each term). Example: 3x(2x^2 - 5x + 4) = 6x^3 - 15x^2 + 12x.'},
  {'type':'heading','text':'FOIL Method (Binomial x Binomial)'},
  {'type':'rule','body':'FOIL: First, Outer, Inner, Last. (a+b)(c+d) = ac + ad + bc + bd. Example: (x+3)(x-2) = x^2 - 2x + 3x - 6 = x^2 + x - 6.'},
  {'type':'example','label':'Example 1','body':'(2x + 5)(x - 3) = 2x^2 - 6x + 5x - 15 = 2x^2 - x - 15.'},
  {'type':'example','label':'Example 2','body':'(x + 4)^2 = (x+4)(x+4) = x^2 + 4x + 4x + 16 = x^2 + 8x + 16.'},
  {'type':'heading','text':'Dividing a Polynomial by a Monomial'},
  {'type':'rule','body':'Divide each term of the polynomial by the monomial separately. Example: (6x^3 - 9x^2 + 3x) / 3x = 2x^2 - 3x + 1.'},
]}),
# ── UNIT 10 ───────────────────────────────────────────────────────────
('ch-52-factoring_gcf.json', {'id':'ch-52','chapterNumber':52,'unit':10,'unitTitle':'Factoring Polynomials','title':'Factoring Polynomials Using GCF','pages':'462-474','blocks':[
  {'type':'text','body':'Factoring is the reverse of distributing. Instead of multiplying out, you find what was multiplied together to get the expression.'},
  {'type':'definition','term':'Greatest Common Factor (GCF)','body':'The largest factor shared by all terms. To factor using GCF: find the GCF of all coefficients and the lowest power of any common variable. Factor it out.'},
  {'type':'rule','body':'Steps: (1) Find GCF of all terms. (2) Divide each term by the GCF. (3) Write as GCF x (remaining polynomial). Always check by distributing back.'},
  {'type':'example','label':'Example 1','body':'Factor 12x^3 - 8x^2 + 4x. GCF = 4x. Answer: 4x(3x^2 - 2x + 1). Check: 4x(3x^2) - 4x(2x) + 4x(1) = 12x^3 - 8x^2 + 4x. Correct.'},
  {'type':'example','label':'Example 2','body':'Factor 6a^2b - 9ab^2 + 3ab. GCF = 3ab. Answer: 3ab(2a - 3b + 1).'},
  {'type':'note','body':'Always look for a GCF first, before trying any other factoring method. It simplifies the remaining expression and makes subsequent steps easier.'},
]}),
('ch-53-factoring_grouping.json', {'id':'ch-53','chapterNumber':53,'unit':10,'unitTitle':'Factoring Polynomials','title':'Factoring Polynomials Using Grouping','pages':'475-480','blocks':[
  {'type':'text','body':'Factoring by grouping is used for polynomials with 4 terms. You group terms in pairs and factor out the GCF from each pair, then factor out the common binomial.'},
  {'type':'rule','body':'Steps: (1) Group terms into two pairs. (2) Factor GCF from each pair. (3) If the remaining binomials match, factor out that binomial. Example: ax + ay + bx + by = a(x+y) + b(x+y) = (a+b)(x+y).'},
  {'type':'example','label':'Example 1','body':'Factor x^3 + 3x^2 + 2x + 6. Group: (x^3 + 3x^2) + (2x + 6) = x^2(x+3) + 2(x+3) = (x^2+2)(x+3).'},
  {'type':'example','label':'Example 2','body':'Factor 2x^3 - x^2 - 10x + 5. Group: (2x^3 - x^2) + (-10x + 5) = x^2(2x-1) - 5(2x-1) = (x^2-5)(2x-1).'},
  {'type':'note','body':'If the two groups do not produce the same binomial, try rearranging the original terms in a different order, then group again.'},
]}),
('ch-54-factoring_trinomials_a1.json', {'id':'ch-54','chapterNumber':54,'unit':10,'unitTitle':'Factoring Polynomials','title':'Factoring Trinomials When a = 1','pages':'481-490','blocks':[
  {'type':'text','body':'For trinomials of the form x^2 + bx + c (where the coefficient of x^2 is 1), find two numbers that multiply to c and add to b.'},
  {'type':'rule','body':'To factor x^2 + bx + c: find two integers p and q where p x q = c and p + q = b. Then: x^2 + bx + c = (x + p)(x + q).'},
  {'type':'example','label':'Example 1','body':'Factor x^2 + 7x + 12. Need two numbers that multiply to 12 and add to 7: 3 and 4. Answer: (x+3)(x+4). Check: x^2 + 4x + 3x + 12 = x^2 + 7x + 12. Correct.'},
  {'type':'example','label':'Example 2','body':'Factor x^2 - 5x + 6. Need: multiply to 6, add to -5: -2 and -3. Answer: (x-2)(x-3).'},
  {'type':'example','label':'Example 3','body':'Factor x^2 + 2x - 15. Need: multiply to -15, add to 2: 5 and -3. Answer: (x+5)(x-3).'},
  {'type':'note','body':'Check signs carefully. If c is positive and b is negative, both factors are negative. If c is negative, the factors have opposite signs.'},
]}),
('ch-55-factoring_trinomials_a_not1.json', {'id':'ch-55','chapterNumber':55,'unit':10,'unitTitle':'Factoring Polynomials','title':'Factoring Trinomials When a is Not 1','pages':'491-494','blocks':[
  {'type':'text','body':'For trinomials ax^2 + bx + c where a is not 1, use the AC method (also called factoring by grouping).'},
  {'type':'rule','body':'AC Method: (1) Multiply a x c. (2) Find two numbers that multiply to ac and add to b. (3) Rewrite the middle term using these two numbers. (4) Factor by grouping.'},
  {'type':'example','label':'Example','body':'Factor 2x^2 + 7x + 3. ac = 6. Need: multiply to 6, add to 7: 1 and 6. Rewrite: 2x^2 + x + 6x + 3. Group: x(2x+1) + 3(2x+1) = (x+3)(2x+1). Check: 2x^2 + x + 6x + 3 = 2x^2 + 7x + 3. Correct.'},
  {'type':'example','label':'Example 2','body':'Factor 3x^2 - 10x + 8. ac = 24. Need: multiply to 24, add to -10: -4 and -6. Rewrite: 3x^2 - 4x - 6x + 8. Group: x(3x-4) - 2(3x-4) = (x-2)(3x-4).'},
  {'type':'note','body':'Trial and error is another method: try factor pairs of a and c and check if they give the correct middle term using FOIL. The AC method is more systematic.'},
]}),
('ch-56-special_factoring.json', {'id':'ch-56','chapterNumber':56,'unit':10,'unitTitle':'Factoring Polynomials','title':'Factoring Using Special Formulas','pages':'495-504','blocks':[
  {'type':'heading','text':'Difference of Two Squares'},
  {'type':'rule','body':'a^2 - b^2 = (a+b)(a-b). Both terms must be perfect squares and there is subtraction. Example: x^2 - 25 = (x+5)(x-5). 4x^2 - 9 = (2x+3)(2x-3).'},
  {'type':'heading','text':'Perfect Square Trinomials'},
  {'type':'rule','body':'a^2 + 2ab + b^2 = (a+b)^2. a^2 - 2ab + b^2 = (a-b)^2. Example: x^2 + 6x + 9 = (x+3)^2. x^2 - 10x + 25 = (x-5)^2.'},
  {'type':'example','label':'Examples','body':'x^2 - 49 = (x+7)(x-7). 9y^2 - 1 = (3y+1)(3y-1). x^2 + 8x + 16 = (x+4)^2. 4x^2 - 12x + 9 = (2x-3)^2.'},
  {'type':'note','body':'To check if a trinomial is a perfect square: the first and last terms must be perfect squares, and the middle term must be twice the product of their square roots. x^2 + 6x + 9: sqrt(x^2)=x, sqrt(9)=3, 2(x)(3)=6x. Yes!'},
]}),
# ── UNIT 11 ───────────────────────────────────────────────────────────
('ch-57-square_roots.json', {'id':'ch-57','chapterNumber':57,'unit':11,'unitTitle':'Radicals','title':'Square Roots and Cube Roots','pages':'506-514','blocks':[
  {'type':'definition','term':'Square Root','body':'The square root of n (written sqrt(n)) is the number that, when squared, equals n. sqrt(25) = 5 because 5^2 = 25. Every positive number has two square roots: positive and negative.'},
  {'type':'definition','term':'Perfect Square','body':'A number whose square root is a whole number. Examples: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100.'},
  {'type':'definition','term':'Cube Root','body':'The cube root of n (written as the cube root symbol or n^(1/3)) is the number that, when cubed, equals n. Cube root of 27 = 3 because 3^3 = 27. Cube root of -8 = -2 because (-2)^3 = -8.'},
  {'type':'rule','body':'Square roots of negative numbers are not real numbers. sqrt(-4) is not real. However, cube roots of negative numbers are real: cube root of -27 = -3.'},
  {'type':'example','label':'Examples','body':'sqrt(64) = 8. sqrt(144) = 12. cube root of 8 = 2. cube root of 125 = 5. sqrt(0.25) = 0.5. sqrt(1/9) = 1/3.'},
  {'type':'note','body':'On a calculator, sqrt(x) finds the principal (positive) square root. To find the negative root, add a minus sign: -sqrt(x).'},
]}),
('ch-58-simplifying_radicals.json', {'id':'ch-58','chapterNumber':58,'unit':11,'unitTitle':'Radicals','title':'Simplifying Radicals','pages':'515-520','blocks':[
  {'type':'rule','body':'A radical is simplified when: no perfect square factor remains under the radical, no fractions under the radical, no radicals in the denominator.'},
  {'type':'rule','body':'To simplify sqrt(n): find the largest perfect square factor of n. Split, take the square root of the perfect square part. Example: sqrt(72) = sqrt(36 x 2) = 6 sqrt(2).'},
  {'type':'example','label':'Examples','body':'sqrt(50) = sqrt(25 x 2) = 5 sqrt(2). sqrt(98) = 7 sqrt(2). sqrt(12) = 2 sqrt(3). sqrt(75) = 5 sqrt(3).'},
  {'type':'rule','body':'Rationalizing the denominator: multiply numerator and denominator by the radical in the denominator. Example: 3/sqrt(5) = 3 sqrt(5)/5.'},
  {'type':'note','body':'Product rule: sqrt(a x b) = sqrt(a) x sqrt(b). Quotient rule: sqrt(a/b) = sqrt(a)/sqrt(b). These only work when a >= 0 and b > 0.'},
]}),
('ch-59-adding_subtracting_radicals.json', {'id':'ch-59','chapterNumber':59,'unit':11,'unitTitle':'Radicals','title':'Adding & Subtracting Radicals','pages':'521-526','blocks':[
  {'type':'definition','term':'Like Radicals','body':'Radical terms with the same radicand (number under the radical) and the same index. Like terms: 3 sqrt(5) and 7 sqrt(5). Unlike: 3 sqrt(2) and 3 sqrt(5).'},
  {'type':'rule','body':'Only like radicals can be added or subtracted. Combine coefficients and keep the radical. Example: 3 sqrt(7) + 5 sqrt(7) = 8 sqrt(7). 9 sqrt(2) - 4 sqrt(2) = 5 sqrt(2).'},
  {'type':'rule','body':'Always simplify radicals first, then check for like terms. Example: sqrt(12) + sqrt(27) = 2 sqrt(3) + 3 sqrt(3) = 5 sqrt(3).'},
  {'type':'example','label':'Example','body':'2 sqrt(18) - sqrt(8) + 3 sqrt(50). Simplify: 6 sqrt(2) - 2 sqrt(2) + 15 sqrt(2) = 19 sqrt(2).'},
  {'type':'note','body':'sqrt(3) + sqrt(5) cannot be simplified — they are unlike radicals. Do not confuse radical addition with multiplication: sqrt(3) x sqrt(5) = sqrt(15).'},
]}),
('ch-60-multiplying_dividing_radicals.json', {'id':'ch-60','chapterNumber':60,'unit':11,'unitTitle':'Radicals','title':'Multiplying & Dividing Radicals','pages':'527-532','blocks':[
  {'type':'rule','body':'Multiplying radicals: sqrt(a) x sqrt(b) = sqrt(a x b). Multiply coefficients together, multiply radicands together, then simplify. Example: 3 sqrt(2) x 4 sqrt(5) = 12 sqrt(10).'},
  {'type':'example','label':'Example 1','body':'sqrt(6) x sqrt(8) = sqrt(48) = 4 sqrt(3). OR: sqrt(6) x sqrt(8) = sqrt(2 x 3) x sqrt(4 x 2) = 2 sqrt(2) x sqrt(6) ... easier: sqrt(48) = sqrt(16 x 3) = 4 sqrt(3).'},
  {'type':'example','label':'Example 2','body':'(2 sqrt(3))^2 = 4 x 3 = 12. (sqrt(5) + sqrt(2))(sqrt(5) - sqrt(2)) = 5 - 2 = 3 (difference of squares pattern).'},
  {'type':'rule','body':'Dividing radicals: sqrt(a)/sqrt(b) = sqrt(a/b). Always rationalize the denominator (remove the radical from the denominator) by multiplying by the conjugate or the radical itself.'},
  {'type':'note','body':'Conjugate of (a + sqrt(b)) is (a - sqrt(b)). Multiplying by the conjugate eliminates the radical: (sqrt(3) + sqrt(2))(sqrt(3) - sqrt(2)) = 3 - 2 = 1.'},
]}),
# ── UNIT 12 ───────────────────────────────────────────────────────────
('ch-61-intro_quadratics.json', {'id':'ch-61','chapterNumber':61,'unit':12,'unitTitle':'Quadratic Equations','title':'Introduction to Quadratic Equations','pages':'534-540','blocks':[
  {'type':'definition','term':'Quadratic Equation','body':'An equation of the form ax^2 + bx + c = 0, where a is not 0. The highest power of x is 2. Examples: x^2 - 5x + 6 = 0, 2x^2 + 3x - 2 = 0.'},
  {'type':'definition','term':'Standard Form','body':'ax^2 + bx + c = 0. Coefficient a is the leading coefficient; c is the constant. Always rewrite a quadratic in standard form before solving.'},
  {'type':'rule','body':'Solutions (roots) of a quadratic: a quadratic equation can have 2 real solutions, 1 real solution (repeated), or 0 real solutions (complex). The discriminant b^2 - 4ac determines which case.'},
  {'type':'note','body':'Quadratics arise in area problems, projectile motion, and optimization. They are the next step beyond linear equations. Methods to solve: factoring, square roots, completing the square, quadratic formula.'},
]}),
('ch-62-solving_by_factoring.json', {'id':'ch-62','chapterNumber':62,'unit':12,'unitTitle':'Quadratic Equations','title':'Solving Quadratic Equations by Factoring','pages':'541-552','blocks':[
  {'type':'rule','body':'Zero Product Property: if A x B = 0, then A = 0 or B = 0. This is the basis of solving by factoring. If you can factor the quadratic into two binomials, set each equal to zero and solve.'},
  {'type':'rule','body':'Steps: (1) Write the equation in standard form (= 0). (2) Factor completely. (3) Set each factor equal to zero. (4) Solve each mini-equation. (5) Check solutions in the original equation.'},
  {'type':'example','label':'Example 1','body':'Solve x^2 - 7x + 12 = 0. Factor: (x-3)(x-4) = 0. Set each to zero: x-3=0 -> x=3; x-4=0 -> x=4. Solutions: x=3 and x=4.'},
  {'type':'example','label':'Example 2','body':'Solve 2x^2 + 5x - 3 = 0. Factor: (2x-1)(x+3) = 0. Solutions: x = 1/2 and x = -3.'},
  {'type':'note','body':'Always move everything to one side first. x^2 = 7x -> x^2 - 7x = 0 -> x(x-7) = 0 -> x = 0 or x = 7. Do not divide both sides by x (you would lose the x = 0 solution).'},
]}),
('ch-63-solving_square_roots.json', {'id':'ch-63','chapterNumber':63,'unit':12,'unitTitle':'Quadratic Equations','title':'Solving Quadratic Equations by Taking Square Roots','pages':'553-560','blocks':[
  {'type':'rule','body':'If x^2 = k, then x = sqrt(k) or x = -sqrt(k) (written as x = +/- sqrt(k)). This method works best when there is no x-term (b = 0).'},
  {'type':'example','label':'Example 1','body':'Solve x^2 = 49. x = +/- 7. Solutions: x = 7 and x = -7.'},
  {'type':'example','label':'Example 2','body':'Solve 3x^2 - 48 = 0. Add 48: 3x^2 = 48. Divide by 3: x^2 = 16. x = +/- 4.'},
  {'type':'example','label':'Example 3','body':'Solve (x + 2)^2 = 25. x + 2 = +/- 5. Case 1: x + 2 = 5, so x = 3. Case 2: x + 2 = -5, so x = -7.'},
  {'type':'note','body':'If k < 0 (e.g., x^2 = -9), there is no real solution because no real number squared gives a negative number.'},
]}),
('ch-64-completing_the_square.json', {'id':'ch-64','chapterNumber':64,'unit':12,'unitTitle':'Quadratic Equations','title':'Solving Quadratic Equations by Completing the Square','pages':'561-572','blocks':[
  {'type':'text','body':'Completing the square converts any quadratic into the form (x + h)^2 = k, which can then be solved using square roots.'},
  {'type':'rule','body':'Steps for x^2 + bx + c = 0: (1) Move c to the right side. (2) Add (b/2)^2 to both sides. (3) Factor the left side as (x + b/2)^2. (4) Take square roots of both sides. (5) Solve for x.'},
  {'type':'example','label':'Example','body':'Solve x^2 + 6x + 5 = 0. Move constant: x^2 + 6x = -5. Add (6/2)^2 = 9: x^2 + 6x + 9 = 4. Factor: (x+3)^2 = 4. Square root: x+3 = +/- 2. Solutions: x = -1 and x = -5.'},
  {'type':'rule','body':'If the leading coefficient a is not 1, first divide ALL terms by a. Example: 2x^2 + 8x - 10 = 0 -> x^2 + 4x - 5 = 0, then complete the square.'},
  {'type':'note','body':'Completing the square is the method used to derive the quadratic formula. It works for any quadratic, but is most efficient when b is even (so b/2 is an integer).'},
]}),
('ch-65-quadratic_formula.json', {'id':'ch-65','chapterNumber':65,'unit':12,'unitTitle':'Quadratic Equations','title':'Solving Quadratic Equations with the Quadratic Formula','pages':'573-578','blocks':[
  {'type':'rule','body':'The Quadratic Formula: for ax^2 + bx + c = 0, x = (-b +/- sqrt(b^2 - 4ac)) / 2a. This formula works for ANY quadratic equation, always.'},
  {'type':'example','label':'Example 1','body':'Solve 2x^2 + 3x - 2 = 0. a=2, b=3, c=-2. x = (-3 +/- sqrt(9 + 16)) / 4 = (-3 +/- 5) / 4. x = 1/2 or x = -2.'},
  {'type':'example','label':'Example 2','body':'Solve x^2 - 4x + 1 = 0. a=1, b=-4, c=1. x = (4 +/- sqrt(16-4)) / 2 = (4 +/- sqrt(12)) / 2 = (4 +/- 2 sqrt(3)) / 2 = 2 +/- sqrt(3).'},
  {'type':'note','body':'Memorize the quadratic formula: "negative b, plus or minus square root of b squared minus 4ac, all over 2a." It is one of the most important formulas in algebra.'},
]}),
('ch-66-discriminant.json', {'id':'ch-66','chapterNumber':66,'unit':12,'unitTitle':'Quadratic Equations','title':'The Discriminant and the Number of Solutions','pages':'579-586','blocks':[
  {'type':'definition','term':'Discriminant','body':'The expression b^2 - 4ac, found under the radical in the quadratic formula. It tells you how many real solutions a quadratic equation has WITHOUT solving it.'},
  {'type':'rule','body':'If b^2 - 4ac > 0: TWO distinct real solutions (two x-intercepts on the graph). If b^2 - 4ac = 0: ONE real solution (the parabola just touches the x-axis). If b^2 - 4ac < 0: NO real solutions (parabola does not cross x-axis).'},
  {'type':'example','label':'Example 1','body':'x^2 - 6x + 5 = 0. Discriminant = 36 - 20 = 16 > 0. Two real solutions.'},
  {'type':'example','label':'Example 2','body':'x^2 - 6x + 9 = 0. Discriminant = 36 - 36 = 0. One real solution (x = 3, a double root).'},
  {'type':'example','label':'Example 3','body':'x^2 + x + 1 = 0. Discriminant = 1 - 4 = -3 < 0. No real solutions.'},
  {'type':'note','body':'The discriminant is a powerful preview tool. When designing real-world problems, you can use the discriminant to determine whether the scenario has valid mathematical solutions before solving completely.'},
]}),
# ── UNIT 13 ───────────────────────────────────────────────────────────
('ch-67-graphing_quadratic_functions.json', {'id':'ch-67','chapterNumber':67,'unit':13,'unitTitle':'Quadratic Functions','title':'Graphing Quadratic Functions','pages':'588-610','blocks':[
  {'type':'definition','term':'Quadratic Function','body':'A function of the form f(x) = ax^2 + bx + c (a not 0). Its graph is a U-shaped curve called a parabola.'},
  {'type':'definition','term':'Vertex','body':'The highest or lowest point of the parabola. The x-coordinate of the vertex is x = -b/(2a). Substitute back to find y. The vertex is a minimum if a > 0 (opens up), maximum if a < 0 (opens down).'},
  {'type':'definition','term':'Axis of Symmetry','body':'The vertical line x = -b/(2a) that passes through the vertex, dividing the parabola into two mirror-image halves.'},
  {'type':'rule','body':'To graph a parabola: (1) Find the axis of symmetry: x = -b/2a. (2) Find the vertex. (3) Find y-intercept (set x=0). (4) Find one or two other points. (5) Reflect points across the axis of symmetry. (6) Draw the smooth curve.'},
  {'type':'example','label':'Example','body':'Graph y = x^2 - 4x + 3. Axis: x = 4/2 = 2. Vertex: y = 4 - 8 + 3 = -1. Vertex: (2,-1). y-intercept: (0,3). x-intercepts: factor -> (x-1)(x-3)=0, so (1,0) and (3,0). Parabola opens upward (a=1>0).'},
  {'type':'note','body':'The x-intercepts of the quadratic function are the solutions to the quadratic equation. A parabola with no x-intercepts has a negative discriminant.'},
]}),
('ch-68-solving_by_graphing.json', {'id':'ch-68','chapterNumber':68,'unit':13,'unitTitle':'Quadratic Functions','title':'Solving Quadratic Equations by Graphing','pages':'611-618','blocks':[
  {'type':'text','body':'The solutions (roots) of ax^2 + bx + c = 0 are the x-intercepts of the parabola y = ax^2 + bx + c. Graphing gives a visual way to find or estimate solutions.'},
  {'type':'rule','body':'To solve by graphing: (1) Write the equation in standard form. (2) Graph y = ax^2 + bx + c. (3) Find where the parabola crosses the x-axis. Those x-values are the solutions.'},
  {'type':'example','label':'Example 1','body':'Solve x^2 - x - 6 = 0 by graphing. Graph y = x^2 - x - 6. The parabola crosses the x-axis at x = -2 and x = 3. Solutions: x = -2 and x = 3. Check: (-2)^2 - (-2) - 6 = 4+2-6=0. Correct.'},
  {'type':'rule','body':'Reading solutions from a graph: if the parabola touches (but does not cross) the x-axis, there is one solution. If it does not reach the x-axis, there are no real solutions.'},
  {'type':'note','body':'Graphing gives exact solutions only when the roots are integers or simple fractions. For irrational solutions (like 2 +/- sqrt(3)), use the quadratic formula for the exact answer and graphing for approximation.'},
]}),
]

for fname, data in chapters:
    path = os.path.join(out, fname)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f'  {fname}: {len(data["blocks"])} blocks')
print('Done.')
