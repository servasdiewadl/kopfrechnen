/**
 * Kopfrechnen Beamer - Generator für Stufen 1 bis 10
 * Garantiert saubere Zahlen ohne IEEE 754 Floating-Point-Glitches
 */

// Hilfsfunktion: Zufällige ganze Zahl im Bereich [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Hilfsfunktion: Zufälliges Element aus Array
function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Hilfsfunktion: Zahl sauber runden auf max 2 Nachkommastellen (vermeidet 0.30000000000000004)
function roundClean(num, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

// Formatierung für deutsche Anzeige (Komma statt Punkt)
function formatNumber(num) {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  // Max 2 Dezimalstellen
  const rounded = roundClean(num, 2);
  return rounded.toString().replace('.', ',');
}

// Formatierung für negative Zahlen in Termen: Klammern setzen wenn nötig
function wrapNegative(num, forceWrap = false) {
  if (num < 0 || forceWrap) {
    return `(${formatNumber(num)})`;
  }
  return formatNumber(num);
}

/**
 * STUFE 1:
 * - Zahlenraum bis 1000
 * - Nur natürliche Zahlen (Ergebnis >= 0)
 * - Nur Addition & Subtraktion
 * - Eher glatte, gut machbare Zahlen (z. B. Zehner, Hunderter, einfache Einer)
 */
function generateLevel1() {
  const isAddition = Math.random() < 0.5;

  if (isAddition) {
    // 3 Varianten für angenehme Abwechslung:
    // a) Hunderter + Hunderter/Zehner (z.B. 400 + 350, 250 + 400)
    // b) Zehnerzahlen (z.B. 340 + 230, 560 + 170)
    // c) Zahl bis 1000 + glatter Zehner/Hunderter (z.B. 324 + 50, 412 + 200)
    const variant = randInt(1, 3);
    let a, b;
    if (variant === 1) {
      a = randInt(1, 7) * 100;
      b = randInt(1, (1000 - a) / 50) * 50;
    } else if (variant === 2) {
      a = randInt(5, 50) * 10;
      b = randInt(5, Math.floor((1000 - a) / 10)) * 10;
    } else {
      a = randInt(50, 700);
      b = randChoice([10, 20, 30, 40, 50, 100, 200, 300]);
      if (a + b > 1000) a = 1000 - b - randInt(10, 50);
    }
    const res = a + b;
    return {
      text: `${formatNumber(a)} + ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res),
      hint: `Tipp: ${formatNumber(a)} + ${formatNumber(b)} = ${formatNumber(res)}`
    };
  } else {
    // Subtraktion (Ergebnis >= 0, Zahlenraum bis 1000)
    const variant = randInt(1, 3);
    let a, b;
    if (variant === 1) {
      a = randInt(3, 10) * 100;
      b = randInt(1, a / 50 - 1) * 50;
    } else if (variant === 2) {
      a = randInt(20, 95) * 10;
      b = randInt(5, (a / 10) - 2) * 10;
    } else {
      a = randInt(150, 950);
      b = randChoice([10, 20, 30, 50, 100, 200]);
      if (b >= a) a = b + randInt(20, 100);
    }
    const res = a - b;
    return {
      text: `${formatNumber(a)} - ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res),
      hint: `Tipp: ${formatNumber(a)} - ${formatNumber(b)} = ${formatNumber(res)}`
    };
  }
}

/**
 * STUFE 2:
 * - Zahlenraum bis 1000
 * - Nur natürliche Zahlen (Ergebnis >= 0)
 * - Anspruchsvollere Zehner-/Hunderterübergänge, unrunde Zahlen
 */
function generateLevel2() {
  const isAddition = Math.random() < 0.5;

  if (isAddition) {
    // Ungerade, echte dreistellige oder zweistellige Zahlen mit Übertrag
    // z.B. 387 + 246, 568 + 275, 489 + 364
    let a = randInt(145, 680);
    let b = randInt(125, 1000 - a);
    // Stelle sicher, dass mindestens die Einer oder Zehner einen Übertrag haben
    if ((a % 10) + (b % 10) < 10) {
      b += (10 - ((a % 10) + (b % 10))) + randInt(1, 5);
      if (a + b > 1000) {
        a -= 150;
      }
    }
    const res = a + b;
    return {
      text: `${formatNumber(a)} + ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res),
      hint: `Übertrag beachten: ${formatNumber(a)} + ${formatNumber(b)} = ${formatNumber(res)}`
    };
  } else {
    // Anspruchsvolle Subtraktion mit Zehner- und evtl. Hunderterübergang
    // z.B. 712 - 348, 603 - 279, 835 - 468
    let a = randInt(350, 985);
    let b = randInt(128, a - 50);
    // Sorge für echten Übertrag an der Einerstelle
    if (a % 10 >= b % 10) {
      a = Math.floor(a / 10) * 10 + randInt(0, 4);
      b = Math.floor(b / 10) * 10 + randInt(5, 9);
      if (b >= a) a += 100;
    }
    const res = a - b;
    return {
      text: `${formatNumber(a)} - ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res),
      hint: `${formatNumber(a)} - ${formatNumber(b)} = ${formatNumber(res)}`
    };
  }
}

/**
 * STUFE 3:
 * - Zahlenraum bis 200
 * - Rationale Zahlen mit maximal 1 Kommastelle
 * - Nur positive Zahlen
 * - Addition, Subtraktion oder einfache Multiplikation/Division mit max. 1 Dezimalstelle
 */
function generateLevel3() {
  const type = randChoice(['add', 'sub', 'mult', 'div']);

  if (type === 'add') {
    // 34.5 + 42.8 = 77.3
    const aTenths = randInt(50, 950); // 5.0 bis 95.0
    const maxBTenths = 2000 - aTenths;
    const bTenths = randInt(40, Math.min(maxBTenths, 850));
    const a = aTenths / 10;
    const b = bTenths / 10;
    const res = roundClean(a + b, 1);
    return {
      text: `${formatNumber(a)} + ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else if (type === 'sub') {
    // 124.6 - 48.9 = 75.7
    const aTenths = randInt(500, 1950); // 50.0 bis 195.0
    const bTenths = randInt(50, aTenths - 50);
    const a = aTenths / 10;
    const b = bTenths / 10;
    const res = roundClean(a - b, 1);
    return {
      text: `${formatNumber(a)} - ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else if (type === 'mult') {
    // z.B. 12.4 * 2 = 24.8 oder 1.5 * 14 = 21 oder 4.5 * 6 = 27
    const variant = randChoice([1, 2]);
    let a, b, res;
    if (variant === 1) {
      // 1 Dezimalstelle mal einstellige Zahl (2..8)
      a = randInt(15, 95) / 10; // 1.5 bis 9.5
      b = randInt(2, 6);
      res = roundClean(a * b, 1);
    } else {
      // 1.5 oder 2.5 oder 0.5 mal gerade Zahl
      a = randChoice([1.5, 2.5, 3.5, 4.5, 0.5]);
      b = randInt(2, 20) * 2; // gerade
      res = roundClean(a * b, 1);
    }
    return {
      text: `${formatNumber(a)} · ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else {
    // Division mit glattem Ergebnis oder max 1 Dezimalstelle
    // z.B. 48.6 : 2 = 24.3 oder 75.5 : 5 = 15.1 oder 84 : 4 = 21
    const divisor = randChoice([2, 3, 4, 5, 10]);
    const quotientTenths = randInt(30, Math.floor(1900 / divisor)); // Ergebnis 3.0 bis ...
    const quotient = quotientTenths / 10;
    const dividend = roundClean(quotient * divisor, 1);
    return {
      text: `${formatNumber(dividend)} : ${formatNumber(divisor)}`,
      result: quotient,
      formattedResult: formatNumber(quotient)
    };
  }
}

/**
 * STUFE 4:
 * - Zahlenraum bis 500
 * - Einführung zweistellige Multiplikation mit einstelligen Zahlen
 * - Saubere Divisionen
 * - Dezimalzahlen (1 Nachkommastelle) bis 500
 */
function generateLevel4() {
  const type = randChoice(['mult', 'div', 'add_dec', 'sub_dec']);

  if (type === 'mult') {
    // 2-stellig mal 1-stellig (z.B. 17 · 8 = 136, 24 · 7 = 168, 36 · 6 = 216)
    const a = randInt(13, 49);
    const b = randInt(3, 9);
    const res = a * b;
    return {
      text: `${formatNumber(a)} · ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else if (type === 'div') {
    // 3-stellig geteilt durch 1-stellig, glattes Ergebnis (z.B. 324 : 6 = 54, 455 : 7 = 65)
    const quotient = randInt(15, 85);
    const divisor = randInt(3, 9);
    const dividend = quotient * divisor;
    return {
      text: `${formatNumber(dividend)} : ${formatNumber(divisor)}`,
      result: quotient,
      formattedResult: formatNumber(quotient)
    };
  } else if (type === 'add_dec') {
    // Größere Dezimalzahlen bis 500
    const a = randInt(800, 2800) / 10; // 80.0 bis 280.0
    const b = randInt(500, Math.min(2000, 4900 - a * 10)) / 10;
    const res = roundClean(a + b, 1);
    return {
      text: `${formatNumber(a)} + ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else {
    // Subtraktion Dezimal bis 500
    const a = randInt(1800, 4800) / 10; // 180.0 bis 480.0
    const b = randInt(400, a * 10 - 200) / 10;
    const res = roundClean(a - b, 1);
    return {
      text: `${formatNumber(a)} - ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  }
}

/**
 * STUFE 5:
 * - Zahlenraum bis 1000
 * - Anspruchsvollere Multiplikation (z.B. 15 · 16 = 240, 25 · 18 = 450, 18 · 14 = 252)
 * - Division mit zweistelligen Zahlen (z.B. 480 : 12 = 40, 375 : 15 = 25, 625 : 25 = 25)
 * - Multiplikation mit Dezimalzahlen (z.B. 4.5 · 14 = 63, 2.5 · 18 = 45)
 */
function generateLevel5() {
  const type = randChoice(['mult2', 'div2', 'mult_dec', 'div_dec']);

  if (type === 'mult2') {
    // zweistellig mal zweistellig (mit handhabbaren Zahlen)
    // z.B. 15 · 24, 25 · 16, 12 · 35, 14 · 18
    const a = randChoice([12, 14, 15, 16, 18, 20, 25, 30, 40]);
    const b = randInt(11, Math.floor(950 / a));
    const res = a * b;
    return {
      text: `${formatNumber(a)} · ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else if (type === 'div2') {
    // Zweistelliger Teiler: 12, 15, 16, 18, 20, 25, 50
    const divisor = randChoice([12, 14, 15, 16, 20, 25, 30, 50]);
    const quotient = randInt(8, Math.floor(980 / divisor));
    const dividend = quotient * divisor;
    return {
      text: `${formatNumber(dividend)} : ${formatNumber(divisor)}`,
      result: quotient,
      formattedResult: formatNumber(quotient)
    };
  } else if (type === 'mult_dec') {
    // z.B. 3.5 · 16 = 56, 1.5 · 28 = 42, 4.5 · 18 = 81
    const a = randChoice([1.5, 2.5, 3.5, 4.5, 5.5, 7.5]);
    const b = randInt(4, 28) * 2; // gerade Zahl
    const res = roundClean(a * b, 1);
    return {
      text: `${formatNumber(a)} · ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else {
    // Division von Dezimalzahl mit glatter Zahl: 64.8 : 8 = 8.1 oder 84.7 : 7 = 12.1
    const divisor = randInt(3, 9);
    const quotientTenths = randInt(25, 120);
    const quotient = quotientTenths / 10;
    const dividend = roundClean(quotient * divisor, 1);
    return {
      text: `${formatNumber(dividend)} : ${formatNumber(divisor)}`,
      result: quotient,
      formattedResult: formatNumber(quotient)
    };
  }
}

/**
 * STUFE 6:
 * - Einführung von 2 Nachkommastellen bei Addition & Subtraktion
 * - Multiplikation mit Dezimalzahlen (z.B. 0.25, 0.75, 1.25, 0.5)
 * - Division mit Rest bzw. sauberen 2 Nachkommastellen (z.B. 35 : 4 = 8.75, 74 : 4 = 18.50)
 */
function generateLevel6() {
  const type = randChoice(['add2dec', 'sub2dec', 'mult_cents', 'div_cents']);

  if (type === 'add2dec') {
    // 2 Nachkommastellen (z.B. Geld-/Kommazahlen wie 24.35 + 48.75)
    // Saubere Hundertstel (Viertel, Fünfzigstel oder beliebige 2 Dezimalstellen)
    const aCents = randInt(550, 4500); // 5.50 bis 45.00
    const bCents = randInt(420, 5200);
    const a = aCents / 100;
    const b = bCents / 100;
    const res = roundClean(a + b, 2);
    return {
      text: `${formatNumber(a)} + ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else if (type === 'sub2dec') {
    // Subtraktion mit 2 Nachkommastellen
    const aCents = randInt(2500, 9500);
    const bCents = randInt(550, aCents - 400);
    const a = aCents / 100;
    const b = bCents / 100;
    const res = roundClean(a - b, 2);
    return {
      text: `${formatNumber(a)} - ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else if (type === 'mult_cents') {
    // z.B. 0.25 · 48 = 12, 0.75 · 36 = 27, 1.25 · 24 = 30, 2.25 · 16 = 36
    const a = randChoice([0.25, 0.5, 0.75, 1.25, 1.5, 1.75, 2.25, 2.5]);
    const mult4 = randInt(3, 22) * 4;
    const res = roundClean(a * mult4, 2);
    return {
      text: `${formatNumber(a)} · ${formatNumber(mult4)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else {
    // Division durch 4 oder 8 oder 5 mit sauberem Viertel/Hundertstel
    // z.B. 45 : 4 = 11.25, 63 : 4 = 15.75, 34 : 5 = 6.8
    const divisor = randChoice([4, 4, 5, 8]);
    let quotient;
    if (divisor === 4) {
      quotient = randInt(12, 120) + randChoice([0.25, 0.5, 0.75]);
    } else if (divisor === 5) {
      quotient = randInt(10, 90) + randChoice([0.2, 0.4, 0.6, 0.8]);
    } else {
      quotient = randInt(4, 20) + randChoice([0.125, 0.25, 0.5, 0.75]);
    }
    quotient = roundClean(quotient, 2);
    const dividend = roundClean(quotient * divisor, 2);
    return {
      text: `${formatNumber(dividend)} : ${formatNumber(divisor)}`,
      result: quotient,
      formattedResult: formatNumber(quotient)
    };
  }
}

/**
 * STUFE 7:
 * - Einführung von negativen Zahlen
 * - Subtraktionen mit negativem Ergebnis (z.B. 34 - 82 = -48)
 * - Gemischte Vorzeichen bei Addition/Subtraktion (z.B. -45 + 72 = 27, -28 - 46 = -74)
 * - Rationale Zahlen mit 1 bis 2 Nachkommastellen und Vorzeichen
 */
function generateLevel7() {
  const type = randChoice(['sub_neg', 'neg_add', 'neg_sub', 'double_minus', 'dec_neg']);

  if (type === 'sub_neg') {
    // a - b mit a < b => negatives Ergebnis (z.B. 48 - 115 = -67)
    const a = randInt(25, 350);
    const diff = randInt(20, 280);
    const b = a + diff;
    const res = -diff;
    return {
      text: `${formatNumber(a)} - ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else if (type === 'neg_add') {
    // -a + b (z.B. -65 + 112 = 47 oder -84 + 36 = -48)
    const a = randInt(25, 250);
    const b = randInt(20, 280);
    const res = -a + b;
    return {
      text: `-${formatNumber(a)} + ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else if (type === 'neg_sub') {
    // -a - b = -(a + b) (z.B. -37 - 48 = -85)
    const a = randInt(20, 180);
    const b = randInt(15, 150);
    const res = -a - b;
    return {
      text: `-${formatNumber(a)} - ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else if (type === 'double_minus') {
    // a - (-b) = a + b (z.B. 45 - (-38) = 83 oder -30 - (-55) = 25)
    const a = randInt(-80, 120);
    const b = randInt(15, 95);
    const res = a - (-b);
    return {
      text: `${formatNumber(a)} - (-${formatNumber(b)})`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else {
    // Dezimal mit Vorzeichen (z.B. -14.5 + 32.2 = 17.7 oder 18.5 - 35.8 = -17.3)
    const a = randInt(150, 650) / 10;
    const b = randInt(150, 650) / 10;
    const res = roundClean(-a + b, 1);
    return {
      text: `-${formatNumber(a)} + ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  }
}

/**
 * STUFE 8:
 * - Multiplikation & Division mit negativen Zahlen (z.B. -7 · 14 = -98, -180 : (-12) = 15)
 * - Quadratzahlen (11² bis 25²)
 * - Einfache Potenzen (2³..2⁷, 3²..3⁴, 4³..4⁴, 5²..5³)
 * - Quadratwurzeln sauber (z.B. √144 = 12, √225 = 15, √400 = 20)
 */
function generateLevel8() {
  const type = randChoice(['power', 'root', 'mult_neg', 'div_neg']);

  if (type === 'power') {
    // Potenzen & Quadratzahlen
    const baseVariant = randChoice(['squares', 'powers_of_2', 'powers_of_3_5']);
    if (baseVariant === 'squares') {
      const base = randInt(11, 25);
      const res = base * base;
      return {
        text: `${base}²`,
        result: res,
        formattedResult: formatNumber(res),
        hint: `${base} · ${base} = ${res}`
      };
    } else if (baseVariant === 'powers_of_2') {
      const exp = randInt(3, 8); // 2^3=8 bis 2^8=256
      const res = Math.pow(2, exp);
      const superscripts = { 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸' };
      return {
        text: `2${superscripts[exp]}`,
        result: res,
        formattedResult: formatNumber(res),
        hint: `2 hoch ${exp} = ${res}`
      };
    } else {
      // 3³, 3⁴, 4³, 5³, 10³
      const choice = randChoice([
        { base: 3, exp: 3, sym: '3³', val: 27 },
        { base: 3, exp: 4, sym: '3⁴', val: 81 },
        { base: 4, exp: 3, sym: '4³', val: 64 },
        { base: 5, exp: 3, sym: '5³', val: 125 },
        { base: 10, exp: 3, sym: '10³', val: 1000 }
      ]);
      return {
        text: choice.sym,
        result: choice.val,
        formattedResult: formatNumber(choice.val),
        hint: `${choice.base} hoch ${choice.exp} = ${choice.val}`
      };
    }
  } else if (type === 'root') {
    // Quadratwurzeln aus bekannten Quadraten
    const roots = [
      { val: 11, sq: 121 }, { val: 12, sq: 144 }, { val: 13, sq: 169 },
      { val: 14, sq: 196 }, { val: 15, sq: 225 }, { val: 16, sq: 256 },
      { val: 17, sq: 289 }, { val: 18, sq: 324 }, { val: 19, sq: 361 },
      { val: 20, sq: 400 }, { val: 25, sq: 625 }, { val: 30, sq: 900 }
    ];
    const item = randChoice(roots);
    return {
      text: `√${item.sq}`,
      result: item.val,
      formattedResult: formatNumber(item.val),
      hint: `${item.val}² = ${item.sq}`
    };
  } else if (type === 'mult_neg') {
    // Multiplikation mit negativem Faktor
    const aSign = randChoice([-1, 1]);
    const bSign = aSign === 1 ? -1 : randChoice([-1, 1]);
    const aVal = randInt(6, 18);
    const bVal = randInt(4, 16);
    const a = aSign * aVal;
    const b = bSign * bVal;
    const res = a * b;
    return {
      text: `${formatNumber(a)} · ${wrapNegative(b, true)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else {
    // Division mit negativer Zahl
    const quotientSign = randChoice([-1, 1]);
    const divisorSign = randChoice([-1, 1]);
    const dividendSign = quotientSign * divisorSign;
    const quotientVal = randInt(5, 25);
    const divisorVal = randInt(4, 15);
    const divisor = divisorSign * divisorVal;
    const dividend = dividendSign * (quotientVal * divisorVal);
    const quotient = quotientSign * quotientVal;
    return {
      text: `${formatNumber(dividend)} : ${wrapNegative(divisor, true)}`,
      result: quotient,
      formattedResult: formatNumber(quotient)
    };
  }
}

/**
 * STUFE 9:
 * - Punkt vor Strich mit Vorzeichen / Potenzen
 * - z.B. 12² - 54 = 90, (-4)² + 35 = 51, 8 · (-12) + 150 = 54
 * - Dezimalzahlen mit Potenzen: 1.5² = 2.25, 0.4² = 0.16, 2.5² = 6.25
 * - Terme bis 1000
 */
function generateLevel9() {
  const type = randChoice(['term_power', 'term_mult_add', 'dec_power', 'dec_neg_mult']);

  if (type === 'term_power') {
    // a² ± b oder -a² + b
    const isNegBase = Math.random() < 0.4;
    const base = randInt(8, 20);
    const square = base * base;
    const isPlus = Math.random() < 0.5;
    const b = randInt(15, 180);
    if (isNegBase) {
      // (-base)² + b = square + b
      const res = square + (isPlus ? b : -b);
      return {
        text: `(-${base})² ${isPlus ? '+' : '-'} ${b}`,
        result: res,
        formattedResult: formatNumber(res),
        hint: `(-${base})² = ${square}`
      };
    } else {
      const res = square + (isPlus ? b : -b);
      return {
        text: `${base}² ${isPlus ? '+' : '-'} ${b}`,
        result: res,
        formattedResult: formatNumber(res),
        hint: `${base}² = ${square}`
      };
    }
  } else if (type === 'term_mult_add') {
    // a · b ± c mit negativen Zahlen (Punkt vor Strich)
    // z.B. 7 · (-14) + 200 = -98 + 200 = 102
    // oder 350 - 15 · 12 = 350 - 180 = 170
    const variant = randChoice([1, 2]);
    if (variant === 1) {
      const a = randInt(6, 16);
      const b = randInt(5, 18) * -1;
      const c = randInt(50, 300);
      const prod = a * b;
      const res = prod + c;
      return {
        text: `${a} · (${b}) + ${c}`,
        result: res,
        formattedResult: formatNumber(res),
        hint: `${a} · (${b}) = ${prod}`
      };
    } else {
      const start = randInt(200, 600);
      const a = randInt(8, 25);
      const b = randInt(4, 15);
      const prod = a * b;
      const res = start - prod;
      return {
        text: `${start} - ${a} · ${b}`,
        result: res,
        formattedResult: formatNumber(res),
        hint: `${a} · ${b} = ${prod}`
      };
    }
  } else if (type === 'dec_power') {
    // Dezimalpotenzen (z.B. 1.2², 1.5², 2.5², 0.5², 0.3², 0.4²)
    const choices = [
      { base: 0.3, res: 0.09 },
      { base: 0.4, res: 0.16 },
      { base: 0.5, res: 0.25 },
      { base: 0.6, res: 0.36 },
      { base: 0.8, res: 0.64 },
      { base: 1.1, res: 1.21 },
      { base: 1.2, res: 1.44 },
      { base: 1.3, res: 1.69 },
      { base: 1.4, res: 1.96 },
      { base: 1.5, res: 2.25 },
      { base: 1.6, res: 2.56 },
      { base: 2.5, res: 6.25 }
    ];
    const item = randChoice(choices);
    return {
      text: `${formatNumber(item.base)}²`,
      result: item.res,
      formattedResult: formatNumber(item.res)
    };
  } else {
    // -a.b · c (z.B. -3.5 · 14 = -49 oder -2.5 · (-16) = 40)
    const a = randChoice([1.5, 2.5, 3.5, 4.5, 7.5]);
    const b = randInt(4, 24) * 2;
    const isDoubleNeg = Math.random() < 0.5;
    if (isDoubleNeg) {
      const res = roundClean(a * b, 2);
      return {
        text: `-${formatNumber(a)} · (-${b})`,
        result: res,
        formattedResult: formatNumber(res)
      };
    } else {
      const res = roundClean(-a * b, 2);
      return {
        text: `-${formatNumber(a)} · ${b}`,
        result: res,
        formattedResult: formatNumber(res)
      };
    }
  }
}

/**
 * STUFE 10 (HÖCHSTSTUFE):
 * - Rationale Zahlen mit bis zu 2 Dezimalstellen
 * - Potenzen, Wurzeln, Vorzeichen
 * - Zahlenraum bis 1000, negative Zahlen
 * - Spannende, fordernde Kopfrechenaufgaben mit glatten oder sauberen 2-Nachkommastellen
 */
function generateLevel10() {
  const type = randChoice([
    'power_mixed',
    'dec_two_step',
    'root_mixed',
    'rational_mult',
    'complex_signed'
  ]);

  if (type === 'power_mixed') {
    // z.B. (-15)² - 175 = 225 - 175 = 50
    // oder 2⁸ - 156 = 256 - 156 = 100
    // oder 4³ · (-2) + 200 = -128 + 200 = 72
    const variant = randChoice([1, 2, 3]);
    if (variant === 1) {
      const base = randChoice([13, 14, 15, 16, 17, 18, 19, 20, 25]);
      const sq = base * base;
      const sub = randInt(25, sq - 25);
      const res = sq - sub;
      return {
        text: `(-${base})² - ${sub}`,
        result: res,
        formattedResult: formatNumber(res),
        hint: `(-${base})² = ${sq}`
      };
    } else if (variant === 2) {
      const powers = [
        { term: '2⁶', val: 64 },
        { term: '2⁷', val: 128 },
        { term: '2⁸', val: 256 },
        { term: '3⁴', val: 81 },
        { term: '4³', val: 64 },
        { term: '5³', val: 125 }
      ];
      const p = randChoice(powers);
      const offset = randInt(15, 150);
      const isPlus = Math.random() < 0.5;
      const res = isPlus ? p.val + offset : p.val - offset;
      return {
        text: `${p.term} ${isPlus ? '+' : '-'} ${offset}`,
        result: res,
        formattedResult: formatNumber(res),
        hint: `${p.term} = ${p.val}`
      };
    } else {
      // 3.5² oder 4.5²
      const base = randChoice([0.7, 0.9, 1.5, 2.5, 3.5, 4.5]);
      const res = roundClean(base * base, 2);
      return {
        text: `${formatNumber(base)}²`,
        result: res,
        formattedResult: formatNumber(res)
      };
    }
  } else if (type === 'dec_two_step') {
    // z.B. 2.5 · (-16) + 75 = -40 + 75 = 35
    // oder (-1.25) · 32 = -40
    // oder 0.75 · (-48) - 14 = -36 - 14 = -50
    const a = randChoice([1.25, 1.5, 1.75, 2.25, 2.5, 3.5, 0.75]);
    const mult4 = randInt(3, 15) * 4;
    const prod = roundClean(a * mult4, 2);
    const sign = randChoice([-1, 1]);
    const offset = randInt(10, 80);
    if (sign === -1) {
      // -a · mult4 + offset = -prod + offset
      const res = -prod + offset;
      return {
        text: `-${formatNumber(a)} · ${mult4} + ${offset}`,
        result: res,
        formattedResult: formatNumber(res),
        hint: `-${formatNumber(a)} · ${mult4} = -${prod}`
      };
    } else {
      // a · (-mult4) + offset
      const res = -prod + offset;
      return {
        text: `${formatNumber(a)} · (-${mult4}) + ${offset}`,
        result: res,
        formattedResult: formatNumber(res),
        hint: `${formatNumber(a)} · (-${mult4}) = -${prod}`
      };
    }
  } else if (type === 'root_mixed') {
    // z.B. √625 · (-3) + 125 = 25 · (-3) + 125 = -75 + 125 = 50
    // oder √289 - √144 = 17 - 12 = 5
    const variant = randChoice([1, 2]);
    if (variant === 1) {
      const roots = [
        { sq: 144, root: 12 }, { sq: 169, root: 13 }, { sq: 196, root: 14 },
        { sq: 225, root: 15 }, { sq: 256, root: 16 }, { sq: 400, root: 20 },
        { sq: 625, root: 25 }
      ];
      const r = randChoice(roots);
      const factor = randChoice([-4, -3, -2, 2, 3, 4, 5]);
      const add = randInt(20, 150);
      const res = r.root * factor + add;
      return {
        text: `√${r.sq} · ${wrapNegative(factor, factor < 0)} + ${add}`,
        result: res,
        formattedResult: formatNumber(res),
        hint: `√${r.sq} = ${r.root}, ${r.root} · ${wrapNegative(factor)} = ${r.root * factor}`
      };
    } else {
      // √a + √b oder √a - √b
      const r1 = randChoice([16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225]);
      const r2 = randChoice([16, 25, 36, 49, 64, 81, 100, 121, 144]);
      const val1 = Math.round(Math.sqrt(r1));
      const val2 = Math.round(Math.sqrt(r2));
      const res = val1 - val2;
      return {
        text: `√${r1} - √${r2}`,
        result: res,
        formattedResult: formatNumber(res),
        hint: `√${r1} = ${val1}, √${r2} = ${val2}`
      };
    }
  } else if (type === 'rational_mult') {
    // 2 Dezimalstellen Subtraktion im negativen Bereich
    // z.B. 35.75 - 78.50 = -42.75
    // oder -42.85 - 23.40 = -66.25
    const aCents = randInt(2000, 7500);
    const bCents = randInt(aCents + 1200, aCents + 6500);
    const a = aCents / 100;
    const b = bCents / 100;
    const res = roundClean(a - b, 2);
    return {
      text: `${formatNumber(a)} - ${formatNumber(b)}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  } else {
    // Komplexer negativer Term
    // z.B. (-45) + (-18) · 4 = -45 + (-72) = -117
    // oder 18 · (-15) : 5 = -270 : 5 = -54
    const a = randInt(12, 24);
    const b = randChoice([12, 14, 15, 16, 20]);
    const div = randChoice([2, 3, 4, 5, 6]);
    // (a · b) muss durch div teilbar sein
    const prod = a * b;
    const cleanDiv = Math.floor(prod / div) * div;
    const res = -(cleanDiv / div);
    return {
      text: `${cleanDiv / b} · (-${b}) : ${div}`,
      result: res,
      formattedResult: formatNumber(res)
    };
  }
}

/**
 * Hauptfunktion: Generiert eine einzelne Aufgabe für eine Stufe (1-10)
 */
function generateProblem(level) {
  switch (level) {
    case 1: return generateLevel1();
    case 2: return generateLevel2();
    case 3: return generateLevel3();
    case 4: return generateLevel4();
    case 5: return generateLevel5();
    case 6: return generateLevel6();
    case 7: return generateLevel7();
    case 8: return generateLevel8();
    case 9: return generateLevel9();
    case 10: return generateLevel10();
    default: return generateLevel1();
  }
}

/**
 * Generiert eine vollständige Runde aus 10 Aufgaben
 * Garantiert keine doppelten Aufgaben im selben Durchlauf
 */
function generateRound(level, count = 10) {
  const problems = [];
  const seenTexts = new Set();
  let attempts = 0;

  while (problems.length < count && attempts < 200) {
    attempts++;
    const prob = generateProblem(level);
    if (!seenTexts.has(prob.text)) {
      seenTexts.add(prob.text);
      problems.push({
        id: problems.length + 1,
        level: level,
        text: prob.text,
        result: prob.result,
        formattedResult: prob.formattedResult,
        hint: prob.hint || ''
      });
    }
  }

  // Fallback falls Duplikate bei 200 Versuchen
  while (problems.length < count) {
    const prob = generateProblem(level);
    problems.push({
      id: problems.length + 1,
      level: level,
      text: prob.text,
      result: prob.result,
      formattedResult: prob.formattedResult,
      hint: prob.hint || ''
    });
  }

  return problems;
}

// Node.js Modul-Export für Tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    randInt,
    formatNumber,
    roundClean,
    generateProblem,
    generateRound
  };
}
