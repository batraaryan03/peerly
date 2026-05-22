'use client';

import { problem } from './ProblemSection.styles';
import { useProblemReveal } from './ProblemSection.hooks';

export function ProblemSection() {
  const ref = useProblemReveal();

  return (
    <section ref={ref} className={problem.section}>
      <div className={problem.container}>
        <div className={problem.grid}>
          <div data-reveal>
            <p className={problem.label}>The problem</p>
            <h2 className={problem.heading}>
              Working alone is hard.
              <br />
              Working together is harder.
            </h2>
          </div>
          <div className={problem.body} data-reveal>
            <p>
              Productivity tools give you todo lists, timers, and dashboards.
              What they don&apos;t give you is a reason to show up.
            </p>
            <p>
              Peerly replaces &ldquo;I should work&rdquo; with &ldquo;someone is
              expecting me.&rdquo; You block a time slot. A peer matches it. You
              both arrive.
            </p>
            <p>
              No followers. No leaderboards. No gamification. Just a calendar
              and a commitment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
