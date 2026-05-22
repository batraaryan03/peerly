'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Session, Rating } from '@/types';

interface RatingDialogProps {
  session: Session;
  onClose: () => void;
  onSubmit: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
}

export function RatingDialog({ session, onClose, onSubmit }: RatingDialogProps) {
  const [score, setScore] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const targetName =
    session.hostName || session.participantName || 'Your peer';

  const handleSubmit = () => {
    if (score === 0) return;

    onSubmit({
      sessionId: session.id,
      fromUserId: '',
      toUserId: session.hostId || session.participantId,
      score,
      comment: comment.trim(),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-2xl bg-white/[0.06] p-8 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] text-center">
          <h2 className="text-base font-medium text-foreground">Thank you</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your feedback helps the community.
          </p>
          <button
            onClick={onClose}
            className="mt-5 rounded-lg bg-white/[0.06] px-5 py-2 text-sm font-medium text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors hover:bg-white/[0.1]"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white/[0.06] p-6 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <h2 className="text-base font-medium text-foreground">
          Rate your session
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          How was your session with {targetName}?
        </p>
        <div className="mt-4 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setScore(n)}
              className="rounded p-1 transition-colors hover:bg-white/[0.04]"
            >
              <Star
                className={`h-7 w-7 ${
                  n <= (hovered || score)
                    ? 'fill-emerald-500 text-emerald-500'
                    : 'text-muted-foreground/30'
                }`}
              />
            </button>
          ))}
        </div>
        <div className="mt-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment (optional)"
            rows={3}
            className="w-full resize-none rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none placeholder:text-muted-foreground/40 focus-visible:shadow-[inset_0_0_0_1px_#10b981]"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={score === 0}
          className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-40"
        >
          Submit rating
        </button>
      </div>
    </div>
  );
}
