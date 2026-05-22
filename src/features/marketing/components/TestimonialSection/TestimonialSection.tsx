'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { testimonial } from './TestimonialSection.styles';

gsap.registerPlugin(ScrollTrigger);

export function TestimonialSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('[data-quote]'), {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className={testimonial.section}>
      <div className={testimonial.container}>
        <div className={testimonial.wrapper}>
          <div data-quote className={testimonial.quote}>
            &ldquo;Knowing someone is waiting on the other end makes it
            impossible to skip a session. That single commit changes
            everything.&rdquo;
          </div>
          <div className={testimonial.author}>
            <div className={testimonial.avatar}>RK</div>
            <div>
              <p className={testimonial.name}>Raina Khoury</p>
              <p className={testimonial.role}>Product designer, 47 sessions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
