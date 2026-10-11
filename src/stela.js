const STELLANTIS_WMI = {
  // Franța / PSA
  'VF3': { brand: 'Peugeot', origin: 'Franța' },
  'VR3': { brand: 'Peugeot / Stellantis', origin: 'Franța / Spania' },
  'VF7': { brand: 'Citroën', origin: 'Franța' },
  'VR7': { brand: 'DS Automobiles / Citroën', origin: 'Franța' },
  'VF1': { brand: 'Renault (non-Stellantis)', origin: 'Franța' },

  // Germania / Opel
  'W0L': { brand: 'Opel / Vauxhall', origin: 'Germania' },
  'W0V': { brand: 'Opel / Vauxhall (era Stellantis)', origin: 'Germania / Europa' },
  'VX1': { brand: 'Opel', origin: 'Europa' },

  // Italia / FCA
  'ZFA': { brand: 'Fiat', origin: 'Italia' },
  'ZAR': { brand: 'Alfa Romeo', origin: 'Italia' },
  'ZLA': { brand: 'Lancia', origin: 'Italia' },
  'ZFF': { brand: 'Ferrari (istoric)', origin: 'Italia' },

  // America de Nord / FCA
  '1C4': { brand: 'Jeep', origin: 'SUA' },
  '2C4': { brand: 'Chrysler', origin: 'Canada' },
  '3C4': { brand: 'Dodge / Ram', origin: 'Mexic' }
};

// Coduri frecvente de asamblare PSA / Stellantis (Poziția 11)
const STELLANTIS_PLANTS = {
  'S': 'Madrid (Spania) / Sochaux (Franța)',
  'T': 'Trnava (Slovacia)',
  'P': 'Poissy (Franța)',
  'R': 'Rennes (Franța)',
  'M': 'Mulhouse (Franța)',
  'V': 'Vigo (Spania)',
  'K': 'Kénitra (Maroc)',
  'E': 'Ellesmere Port (Regatul Unit)',
  'G': 'Gliwice (Polonia)',
  'H': 'Hordain (Franța)'
};

const YEAR_MAP = {
  'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014, 'F': 2015, 'G': 2016, 'H': 2017,
  'J': 2018, 'K': 2019, 'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024, 'S': 2025,
  'T': 2026, 'V': 2027, 'W': 2028, 'X': 2029, 'Y': 2030, '1': 2031, '2': 2032
};

function parseStellantisVin(vin) {
  if (typeof vin !== 'string') {
    return { isValid: false, error: 'Inputul trebuie să fie un string.' };
  }

  const cleanVin = vin.trim().toUpperCase();

  // 1. Verificare sintaxă generală VIN (17 caractere, fără I, O, Q)
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(cleanVin)) {
    return {
      isValid: false,
      error: 'Lungimea trebuie să fie de 17 caractere și nu poate conține literele I, O, Q.'
    };
  }

  const wmi = cleanVin.slice(0, 3);
  const stellantisInfo = STELLANTIS_WMI[wmi];

  // 2. Verificare dacă aparține grupului Stellantis
  if (!stellantisInfo) {
    return {
      isValid: false,
      error: `WMI-ul '${wmi}' nu corespunde unei mărci cunoscute Stellantis.`
    };
  }

  const vds = cleanVin.slice(3, 9);         // Pozițiile 4-9 (Model / Motorizare)
  const yearChar = cleanVin[9];             // Poziția 10 (An model)
  const plantChar = cleanVin[10];           // Poziția 11 (Uzină)
  const serialNumber = cleanVin.slice(11);  // Pozițiile 12-17 (Serie producție)

  return {
    isValid: true,
    vin: cleanVin,
    brand: stellantisInfo.brand,
    countryOfOrigin: stellantisInfo.origin,
    vdsCode: vds,
    modelYear: YEAR_MAP[yearChar] || 'Necunoscut / Pre-2010',
    assemblyPlant: STELLANTIS_PLANTS[plantChar] || `Cod uzină: ${plantChar}`,
    serialNumber: serialNumber
  };
}

function decodeStellantisVds(vds) {
  const bodyCode = vds.slice(0, 2);   // "KA"
  const engineCode = vds.slice(2, 5); // "HPY"
  const transCode = vds[5];           // "1"

  return {
    rawVds: vds,
    bodyType: bodyCode === 'KA' ? 'Hatchback 5 uși / Crossover (Platformă CMP)' : bodyCode,
    engineFamily: engineCode === 'HPY' ? '1.2 PureTech Turbo Hybrid (EB2 Gen 3)' : engineCode,
    transmission: transCode === '1' ? 'Automată e-DCS6 (Hybrid) / Manuală 6 trepte' : `Index: ${transCode}`
  };
}