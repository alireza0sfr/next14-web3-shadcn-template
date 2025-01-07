import { useEffect, useRef } from "react";

/**
 * Custom hook to detect clicks outside a specified element.
 *
 * @param {function} callback - The function to be called when a click outside the element is detected.
 * @returns {React.RefObject<HTMLDivElement>} - A ref object that should be attached to the element you want to detect clicks outside of.
 *
 * @example
 * const Modal = ({ isOpen, onClose }) => {
 *   const modalRef = useOutsideClick(onClose);
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.5)" }}>
 *       <div ref={modalRef}>
 *         <h2>Modal Content</h2>
 *         <p>Click outside the modal to close it.</p>
 *       </div>
 *     </div>
 *   );
 * };
 */

export function useOutsideClick(
  callback: () => void
): React.RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the ref is not null and the click target is not inside the ref's current element.
      if (ref?.current && !ref?.current?.contains(event.target as Node)) {
        callback();
      }
    };

    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
}
