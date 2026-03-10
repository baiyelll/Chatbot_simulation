import { useState, useEffect } from "react";

/**
 * Typewriter hook — cycles through `words` with a typing + deleting animation.
 * @param {string[]} words
 * @param {number}   typeSpeed   ms per character when typing   (default 80)
 * @param {number}   deleteSpeed ms per character when deleting (default 50)
 * @param {number}   pause       ms to wait before deleting     (default 1800)
 */
export default function useTypewriter(
  words,
  typeSpeed = 80,
  deleteSpeed = 50,
  pause = 1800
) {
  const [display, setDisplay]     = useState("");
  const [wordIdx, setWordIdx]     = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx % words.length];
    let timeout;

    if (!isDeleting && display === current) {
      // Finished typing — wait then start deleting
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && display === "") {
      // Finished deleting — move to next word
      setIsDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setDisplay(
          isDeleting
            ? current.slice(0, display.length - 1)
            : current.slice(0, display.length + 1)
        );
      }, isDeleting ? deleteSpeed : typeSpeed);
    }

    return () => clearTimeout(timeout);
  }, [display, isDeleting, wordIdx, words, typeSpeed, deleteSpeed, pause]);

  return display;
}
