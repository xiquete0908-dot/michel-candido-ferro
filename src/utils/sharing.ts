import LZString from 'lz-string';
import { ShareableWorkoutPayload, WorkoutDay, StudentProfile } from '../types';
import { WORKOUTS, DAY_ORDER } from '../data/workouts';

/**
 * Compacts a payload to remove redundant data before encoding
 */
export function sanitizePayload(payload: ShareableWorkoutPayload): ShareableWorkoutPayload {
  const cleanProfile: StudentProfile = {
    studentName: payload.profile?.studentName?.trim() || '',
    trainerName: payload.profile?.trainerName?.trim() || '',
    goal: payload.profile?.goal?.trim() || '',
    notes: payload.profile?.notes?.trim() || '',
  };

  // Only keep custom workouts that are actually customized
  const cleanCustomWorkouts: Record<string, WorkoutDay> = {};
  if (payload.customWorkouts) {
    Object.keys(payload.customWorkouts).forEach((k) => {
      const day = payload.customWorkouts![k];
      if (day && day.ex) {
        cleanCustomWorkouts[k] = {
          key: day.key,
          label: day.label,
          focus: day.focus,
          sub: day.sub,
          ex: day.ex.map((e) => ({
            id: e.id,
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            rest: e.rest,
            equip: e.equip,
            video: e.video,
            load: e.load,
          })),
        };
      }
    });
  }

  // Omit cover photo if it is a huge data URI or default
  let cleanCover: string | undefined = undefined;
  if (
    payload.coverPhotoUrl &&
    !payload.coverPhotoUrl.startsWith('data:') &&
    payload.coverPhotoUrl.length < 250
  ) {
    cleanCover = payload.coverPhotoUrl;
  }

  return {
    version: 1,
    profile: cleanProfile,
    customWorkouts: Object.keys(cleanCustomWorkouts).length > 0 ? cleanCustomWorkouts : undefined,
    coverPhotoUrl: cleanCover,
    timestamp: Date.now(),
  };
}

/**
 * Encodes a shareable payload to a compact URL-safe string using LZ-String
 */
export function encodeSharePayload(payload: ShareableWorkoutPayload): string {
  try {
    const sanitized = sanitizePayload(payload);
    const jsonStr = JSON.stringify(sanitized);
    // Use LZ-String URL-safe encoding
    const compressed = LZString.compressToEncodedURIComponent(jsonStr);
    return `z_${compressed}`;
  } catch (e) {
    console.error('Failed to encode share payload with compression', e);
    try {
      const jsonStr = JSON.stringify(payload);
      return btoa(unescape(encodeURIComponent(jsonStr)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    } catch {
      return '';
    }
  }
}

/**
 * Decodes a URL-safe string back into a payload (supports compressed 'z_' and legacy base64)
 */
export function decodeSharePayload(encoded: string): ShareableWorkoutPayload | null {
  try {
    const clean = encoded.trim();
    if (clean.startsWith('z_')) {
      const compressed = clean.slice(2);
      const jsonStr = LZString.decompressFromEncodedURIComponent(compressed);
      if (jsonStr) {
        return JSON.parse(jsonStr) as ShareableWorkoutPayload;
      }
    }

    // Try decompressing with LZ-String directly
    const lzAttempt = LZString.decompressFromEncodedURIComponent(clean);
    if (lzAttempt && lzAttempt.startsWith('{')) {
      return JSON.parse(lzAttempt) as ShareableWorkoutPayload;
    }

    // Fallback: try legacy base64
    let base64 = clean.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binaryStr = atob(base64);
    const utf8Str = Array.from(binaryStr)
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('');
    const jsonStr = decodeURIComponent(utf8Str);
    const parsed = JSON.parse(jsonStr) as ShareableWorkoutPayload;
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    return null;
  } catch (e) {
    console.error('Failed to decode share payload', e);
    return null;
  }
}

/**
 * Builds the complete shareable URL
 */
export function buildShareUrl(payload: ShareableWorkoutPayload): string {
  const encoded = encodeSharePayload(payload);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#treino=${encoded}`;
}

/**
 * Formats a clean WhatsApp message
 */
export function formatWhatsAppMessage(
  profile: StudentProfile,
  workoutsMap: Record<string, WorkoutDay>,
  shareUrl: string
): string {
  const student = profile.studentName?.trim() || 'Aluno(a)';
  const trainer = profile.trainerName?.trim() || 'Seu Personal Trainer';
  const goal = profile.goal?.trim() ? `• *Objetivo:* ${profile.goal.trim()}\n` : '';
  const notes = profile.notes?.trim() ? `• *Orientações:* ${profile.notes.trim()}\n` : '';

  let summary = '';
  DAY_ORDER.forEach((key) => {
    const day = workoutsMap[key] || WORKOUTS[key];
    if (day) {
      const exNames =
        day.ex
          .map((e) => e.name)
          .slice(0, 3)
          .join(', ') + (day.ex.length > 3 ? '...' : '');
      summary += `▫️ *${day.label}* (${day.focus}): ${exNames}\n`;
    }
  });

  return (
    `🏋️‍♂️ *FICHA DE TREINO PERSONALIZADA*\n\n` +
    `Olá, *${student}*! ${trainer} preparou seu treino completo no aplicativo Élan Studio.\n\n` +
    `${goal}${notes}` +
    `📋 *Resumo da Semana:*\n${summary}\n` +
    `📲 *Acesse sua ficha interativa completa (com vídeos de execução e registro de cargas):*\n` +
    `${shareUrl}\n\n` +
    `Bons treinos e foco na execução! 💪🔥`
  );
}

/**
 * Formats a plain text export of the workout
 */
export function formatWorkoutTextSummary(
  profile: StudentProfile,
  workoutsMap: Record<string, WorkoutDay>
): string {
  const student = profile.studentName?.trim() || 'Não especificado';
  const trainer = profile.trainerName?.trim() || 'Personal Trainer';
  const goal = profile.goal?.trim() || 'Geral';

  let text = `FICHA DE TREINO - ÉLAN STUDIO\n`;
  text += `Aluno(a): ${student}\n`;
  text += `Professor(a): ${trainer}\n`;
  text += `Objetivo: ${goal}\n`;
  if (profile.notes?.trim()) {
    text += `Orientações: ${profile.notes.trim()}\n`;
  }
  text += `==============================\n\n`;

  DAY_ORDER.forEach((key) => {
    const day = workoutsMap[key] || WORKOUTS[key];
    if (day) {
      text += `📅 ${day.label} - ${day.focus} (${day.sub})\n`;
      text += `------------------------------------\n`;
      day.ex.forEach((e, idx) => {
        text += `${idx + 1}. ${e.name}\n`;
        text += `   Séries: ${e.sets} | Reps: ${e.reps} | Descanso: ${e.rest}\n`;
        text += `   Equipamento: ${e.equip}\n`;
        text += `   Vídeo: ${e.video}\n\n`;
      });
      text += `\n`;
    }
  });

  return text;
}
