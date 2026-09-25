import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share2, PlusSquare, CheckCircle2, Zap } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Check if user dismissed recently (last 3 days)
    const dismissedAt = localStorage.getItem('fitrack_pwa_dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 3) {
        return;
      }
    }

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|crmo/.test(userAgent);

    if (isIosDevice && isSafari) {
      setIsIOS(true);
      // Show prompt after a short delay on iOS
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    // 4. Capture Chrome / Android / Desktop beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 2.5 seconds so user first sees the app
      setTimeout(() => setIsVisible(true), 2500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Track successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      console.log('[PWA] FITRACK installed successfully');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted installation');
        setIsVisible(false);
      } else {
        console.log('[PWA] User dismissed installation');
        dismissPrompt();
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('[PWA] Install prompt error:', err);
    }
  };

  const dismissPrompt = () => {
    setIsVisible(false);
    setShowIOSInstructions(false);
    localStorage.setItem('fitrack_pwa_dismissed', Date.now().toString());
  };

  if (isInstalled || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom App Install Banner */}
      <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="bg-[#161922]/95 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-4 shadow-2xl shadow-black/80 flex items-start gap-3 relative overflow-hidden">
          {/* Subtle Orange Glow Ambient */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* App Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-500/20">
            <Smartphone className="w-6 h-6" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-white text-sm tracking-wide">Install FITRACK App</h4>
              <span className="text-[10px] bg-orange-500/20 text-orange-400 font-semibold px-1.5 py-0.5 rounded border border-orange-500/30">
                PWA
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed">
              100% Offline Gym Logging. Open instantly from your home screen without a browser.
            </p>

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-orange-500/20 transition-transform active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {isIOS ? 'Install on iOS' : 'Install App'}
              </button>
              <button
                onClick={dismissPrompt}
                className="px-2.5 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                Later
              </button>
            </div>
          </div>

          {/* Close X Button */}
          <button
            onClick={dismissPrompt}
            className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#161922] border border-gray-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-white text-base">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Apple Safari does not allow automatic 1-tap install prompts. Follow these 2 easy steps:
            </p>

            <div className="space-y-3 py-1">
              <div className="flex items-start gap-3 bg-gray-800/40 p-3 rounded-xl border border-gray-800">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Step 1: Tap Share</div>
                  <div className="text-[11px] text-gray-400">
                    Tap the <strong>Share</strong> button at the bottom of Safari's toolbar.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-gray-800/40 p-3 rounded-xl border border-gray-800">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Step 2: Add to Home Screen</div>
                  <div className="text-[11px] text-gray-400">
                    Scroll down the share sheet and tap <strong>Add to Home Screen</strong>.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex items-center gap-2 text-xs text-orange-300">
              <Zap className="w-4 h-4 shrink-0 text-orange-400" />
              <span>Enjoy 100% offline gym tracking & fullscreen display!</span>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
