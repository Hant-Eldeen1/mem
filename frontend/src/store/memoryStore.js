import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

export const useMemoryStore = create(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Connection state
      isConnected: false,
      backendError: null,

      // Code state
      currentCode: "",
      breakpoints: new Set(),

      // Execution state
      isExecuting: false,
      currentStep: 0,
      executionHistory: [],
      maxSteps: 0,

      // Memory state
      memoryState: {
        filePointer: 0,
        fileSize: 0,
        structSize: 0,
        structType: null,
        data: [],
        variables: {},
      },

      // Actions
      connectToBackend: () => {
        // Setup WebSocket or Electron IPC listeners
        if (window.electronAPI) {
          window.electronAPI.receiveFromBackend("memory:update", (data) => {
            set({ memoryState: data, isConnected: true });
          });

          window.electronAPI.receiveFromBackend(
            "execution:step",
            (stepData) => {
              set((state) => ({
                executionHistory: [...state.executionHistory, stepData],
                currentStep: state.executionHistory.length,
                maxSteps: state.executionHistory.length,
              }));
            }
          );
        }
      },

      setCode: (code) => set({ currentCode: code }),

      toggleBreakpoint: (line) =>
        set((state) => {
          const newBreakpoints = new Set(state.breakpoints);
          if (newBreakpoints.has(line)) {
            newBreakpoints.delete(line);
          } else {
            newBreakpoints.add(line);
          }
          return { breakpoints: newBreakpoints };
        }),

      executeCode: (code) => {
        set({ isExecuting: true, executionHistory: [], currentStep: 0 });
        if (window.electronAPI) {
          window.electronAPI.sendToBackend("c-code:execute", code);
        }
      },

      stepTo: (stepIndex) => set({ currentStep: stepIndex }),

      stepForward: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, state.maxSteps),
        })),

      stepBackward: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      reset: () =>
        set({
          currentStep: 0,
          executionHistory: [],
          isExecuting: false,
        }),
    })),
    { name: "MemoryStore" }
  )
);
