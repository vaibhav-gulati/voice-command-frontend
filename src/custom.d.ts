// custom.d.ts

declare class SpeechRecognition {
  constructor();
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
  stop: () => void;
}

declare interface Window {
  SpeechRecognition: typeof SpeechRecognition;
}
