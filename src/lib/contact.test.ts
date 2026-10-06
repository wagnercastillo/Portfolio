import { describe, it, expect } from 'vitest';
import { buildMessage, waLink, mailtoLink, formatPhone, localTime, timeDiffLabel, cityFromTz } from './contact';

describe('buildMessage', () => {
  it('mensaje genérico sin selección', () => {
    expect(buildMessage({ needs: [], when: null, note: '', name: '' }))
      .toBe('Hola Cristhoper, vi tu portafolio y me gustaría conversar sobre un proyecto.');
  });
  it('arma necesidades, plazo, nombre y nota', () => {
    expect(buildMessage({ needs: ['una app web', 'una API / backend'], when: 'lo antes posible', note: ' Es para una clínica. ', name: 'Ana' }))
      .toBe('Hola Cristhoper, soy Ana. Vi tu portafolio y necesito una app web y una API / backend. Plazo: lo antes posible. Es para una clínica.');
  });
  it('une tres o más con comas e "y"', () => {
    expect(buildMessage({ needs: ['a', 'b', 'c'], when: null, note: '', name: '' }))
      .toBe('Hola Cristhoper, vi tu portafolio y necesito a, b y c.');
  });
});

describe('enlaces', () => {
  it('waLink deja solo dígitos y codifica el texto', () => {
    expect(waLink('+593 99 148 3745', 'Hola & chao')).toBe('https://wa.me/593991483745?text=Hola%20%26%20chao');
  });
  it('mailtoLink codifica asunto y cuerpo', () => {
    expect(mailtoLink('a@b.com', 'Proyecto: web', 'Hola\nya')).toBe('mailto:a@b.com?subject=Proyecto%3A%20web&body=Hola%0Aya');
  });
});

describe('formatPhone', () => {
  it('formato Ecuador', () => expect(formatPhone('+593991483745')).toBe('+593 99 148 3745'));
  it('otros formatos se devuelven tal cual', () => expect(formatPhone('+1 555 0100')).toBe('+1 555 0100'));
});

describe('localTime', () => {
  // 2026-10-06 15:24 UTC = 10:24 en Guayaquil (UTC-5), martes
  it('hora local y horario laboral', () => {
    expect(localTime(new Date('2026-10-06T15:24:00Z'))).toEqual({ time: '10:24', working: true });
  });
  it('fuera de horario de noche y en fin de semana', () => {
    expect(localTime(new Date('2026-10-07T02:00:00Z')).working).toBe(false); // 21:00 martes
    expect(localTime(new Date('2026-10-10T15:00:00Z')).working).toBe(false); // sábado 10:00
  });
});

describe('timeDiffLabel (offset del visitante en minutos respecto a UTC; Loja = -300)', () => {
  it('misma hora', () => expect(timeDiffLabel(-300)).toBe('¡Estamos en la misma hora!'));
  it('visitante adelante', () => expect(timeDiffLabel(120)).toBe('Vas 7 h adelante de mí'));
  it('visitante detrás', () => expect(timeDiffLabel(-360)).toBe('Vas 1 h detrás de mí'));
  it('medias horas', () => expect(timeDiffLabel(330)).toBe('Vas 10 h 30 min adelante de mí'));
});

describe('cityFromTz', () => {
  it('toma la última parte y cambia _ por espacio', () => expect(cityFromTz('America/Mexico_City')).toBe('Mexico City'));
  it('vacío → "tu ciudad"', () => expect(cityFromTz('')).toBe('tu ciudad'));
});
