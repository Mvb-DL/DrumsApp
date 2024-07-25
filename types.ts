// types.ts

export type Track = {
    name: string;
    previousTrackId: number | null;
    currentTrack: string;
    nextTrackId: number | null;
    trackLevelId: number;
  };
  
  export type Mix = {
    name: string;
    previousMixId: number | null;
    currentMixId: number | null;
    nextMixId: number | null;
    level: number;
    tracks: Track[];
  };
  
  export type Solo = {
    name: string;
    previousSoloId: number | null;
    currentSoloId: number | null;
    nextSoloId: number | null;
    level: number;
    mixes: Mix[];
  };
  
  export type Lesson = {
    name: string;
    previousLessonId: number | null;
    currentLessonId: number | null;
    nextLessonId: number | null;
    solos: Solo[];
  };
  
  export type Part = {
    name: string;
    studentId: string;
    previousPartId: number | null;
    currentPartId: number | null;
    nextPartId: number | null;
    lessons: Lesson[];
  };
  
  export type FormData = {
    part: Part;
  };
  