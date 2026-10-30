import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected error occurred while loading the application.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log technical error details to console without leaking user secrets
    console.error('Captured by React ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // In case localStorage is blocked
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-screen w-full flex items-center justify-center p-4 text-white font-sans select-none"
          style={{
            background: 'linear-gradient(180deg, #0F1742 0%, #141C4E 35%, #101742 70%, #0A0F30 100%)',
          }}
        >
          <div className="max-w-md w-full bg-[#1A0E3C]/95 border-2 border-[#7C4DFF] rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_40px_rgba(124,77,255,0.45)]">
            <div className="w-16 h-16 rounded-2xl bg-[#7C4DFF]/30 border border-[#00D9F5] text-3xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(0,217,245,0.4)]">
              🚀
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[#FFD600] font-heading mb-2 drop-shadow-[0_0_8px_#FFD600]">
              Ms. Trang's English Classes
            </h1>

            <h2 className="text-base sm:text-lg font-bold text-white mb-2">
              Lucky Class Picker Wheel
            </h2>

            <p className="text-xs sm:text-sm text-[#B388FF] font-medium leading-relaxed mb-6">
              The application encountered a minor startup issue. Your class photos and saved classes are safe.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-sm bg-gradient-to-r from-[#00D9F5] to-[#00E5FF] text-[#1A0738] shadow-[0_0_15px_rgba(0,217,245,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Reload Wheel
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-[#12092E] border border-[#7C4DFF] text-[#E0E7FF] hover:bg-[#201048] active:scale-95 transition-all cursor-pointer"
              >
                Reset Defaults
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
