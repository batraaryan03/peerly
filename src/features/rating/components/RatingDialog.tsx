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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="w-full max-w-sm px-6 text-center">
          <h2 className="text-xl font-medium tracking-tight">Thank you</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your feedback helps the community.
          </p>
          <button
            onClick={onClose}
            className="mt-6 rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-sm px-6">
        <h2 className="text-xl font-medium tracking-tight">
          Rate your session
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          How was your session with {targetName}?
        </p>
        <div className="mt-6 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setScore(n)}
              className="rounded p-1 transition-colors hover:bg-muted"
            >
              <Star
                className={`h-8 w-8 ${
                  n <= (hovered || score)
                    ? 'fill-emerald-500 text-emerald-500'
                    : 'text-muted-foreground/30'
                }`}
              />
            </button>
          ))}
        </div>
        <div className="mt-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment (optional)"
            rows={3}
            className="w-full resize-none border-0 border-b border-transparent bg-transparent pb-1 text-sm outline-none ring-0 placeholder:text-muted-foreground/40 focus:border-b focus:border-emerald-500"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={score === 0}
          className="mt-6 w-full rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Submit rating
        </button>
      </div>
    </div>
  );
}
