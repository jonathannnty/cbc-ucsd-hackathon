'use client';

import { useState, useRef } from 'react';
import { AppState, Screen } from '@/types';
import { INITIAL_STATE } from '@/data';
import { TopNavBar, JourneyStepper } from '@/components/Chrome';
import WelcomeScreen from '@/screens/WelcomeScreen';
import IdentityScreen from '@/screens/IdentityScreen';
import EducationScreen from '@/screens/EducationScreen';
import DocumentsScreen from '@/screens/DocumentsScreen';
import BudgetScreen from '@/screens/BudgetScreen';
import PathwayScreen from '@/screens/PathwayScreen';
import VerificationScreen from '@/screens/VerificationScreen';
import PlanScreen from '@/screens/PlanScreen';
import CompleteScreen from '@/screens/CompleteScreen';

const FLOW: Screen[] = [
  'welcome',
  'identity',
  'education',
  'documents',
  'budget',
  'pathway',
  'verification',
  'plan',
  'complete',
];

const STEPPER_SCREENS: Screen[] = [
  'identity',
  'education',
  'documents',
  'budget',
  'pathway',
  'verification',
  'plan',
  'complete',
];

export default function Home() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const highestReachedRef = useRef(0);

  const update = (patch: Partial<AppState>) =>
    setState((s) => ({ ...s, ...patch }));

  const next = () => {
    const i = FLOW.indexOf(state.screen);
    if (i < FLOW.length - 1) {
      const nextIdx = STEPPER_SCREENS.indexOf(FLOW[i + 1]);
      if (nextIdx > highestReachedRef.current) {
        highestReachedRef.current = nextIdx;
      }
      update({ screen: FLOW[i + 1] });
    }
  };

  const back = () => {
    const i = FLOW.indexOf(state.screen);
    if (i > 0) update({ screen: FLOW[i - 1] });
  };

  const stepperIdx = STEPPER_SCREENS.indexOf(state.screen);
  const effectiveHighest = Math.max(stepperIdx, highestReachedRef.current);
  const completedIds =
    effectiveHighest > 0 ? (STEPPER_SCREENS.slice(0, effectiveHighest) as Screen[]) : [];

  const showShell = state.screen !== 'welcome';

  const navigateTo = (screen: Screen) => update({ screen });

  return (
    <div className="app">
      <TopNavBar />

      {showShell ? (
        <div className="shell">
          <JourneyStepper activeId={state.screen} completedIds={completedIds} onNavigate={navigateTo} />
          <main className="canvas">
            {state.screen === 'identity' && (
              <IdentityScreen state={state} update={update} onBack={back} onContinue={next} />
            )}
            {state.screen === 'education' && (
              <EducationScreen state={state} update={update} onBack={back} onContinue={next} />
            )}
            {state.screen === 'documents' && (
              <DocumentsScreen state={state} update={update} onBack={back} onContinue={next} />
            )}
            {state.screen === 'budget' && (
              <BudgetScreen state={state} update={update} onBack={back} onContinue={next} />
            )}
            {state.screen === 'pathway' && (
              <PathwayScreen state={state} update={update} onBack={back} onContinue={next} />
            )}
            {state.screen === 'verification' && (
              <VerificationScreen state={state} update={update} onBack={back} onContinue={next} />
            )}
            {state.screen === 'plan' && (
              <PlanScreen state={state} update={update} onBack={back} onContinue={next} />
            )}
            {state.screen === 'complete' && (
              <CompleteScreen
                onRestart={() => setState(INITIAL_STATE)}
                onPrintPlan={() => {
                  update({ screen: 'plan' });
                  setTimeout(() => window.print(), 300);
                }}
              />
            )}
          </main>
        </div>
      ) : (
        <main className="canvas" style={{ padding: '48px' }}>
          <WelcomeScreen onContinue={next} />
        </main>
      )}
    </div>
  );
}
