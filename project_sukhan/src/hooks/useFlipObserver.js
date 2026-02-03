import { useEffect } from "react";

export default function useFlipObserver(ref, deps = []) {
  useEffect(() => {
    if (!ref.current) return;

    const root = ref.current;

    const observeCards = () => {
      const cards = root.querySelectorAll(".flip-card");

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
            } else {
              entry.target.classList.remove("active");
            }
          });
        },
        {
          root,
          threshold: 0.6
        }
      );

      cards.forEach(card => observer.observe(card));
      return observer;
    };

    const observer = observeCards();

    return () => observer && observer.disconnect();
  }, deps);
}
