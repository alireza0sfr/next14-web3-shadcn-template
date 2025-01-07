import { useCallback, useState } from "react";

import { useModalStore } from "~/stores/modalStore";

interface IProps {
  /** The unique identifier for the modal. */
  ModalId: string;
  /** Indicates whether the modal is open globally (from a global state). */
  isOpenGlobally: boolean;
}

/**
 * A custom React hook to manage the state and lifecycle of a modal component, allowing for local and global state management.
 *
 * @example
 * const { isOpenLocally, handleCloseModal } = useModal({ ModalId: "exampleModal", isOpenGlobally: true });
 *
 * return (
 *   <>
 *     <button onClick={() => handleCloseModal(false)}>Close Modal</button>
 *     {isOpenLocally ? (
 *       <ExampleModal
 *         isOpen={isOpenLocally}
 *         onClose={() => handleCloseModal(false)}
 *       />
 *     ) : null}
 *   </>
 * );
 */

const useModal = ({ ModalId, isOpenGlobally }: IProps) => {
  const [isOpenLocally, setIsOpenLocally] = useState(isOpenGlobally || false);

  const closeModal = useModalStore((state) => state.closeModal);

  const handleCloseModal = useCallback(
    (value: boolean) => {
      if (!value) {
        // Locally update the modal; this ensures that fade out animation works fine
        setIsOpenLocally(false);

        //   Eventually update the global state to remove the modal from the DOM
        setTimeout(() => {
          closeModal(ModalId);
        }, 300); // Adjust timeout to match your close animation duration
      }
    },
    [ModalId, closeModal]
  );

  return {
    /**
     * Indicates whether the modal is currently open locally.
     */
    isOpenLocally,
    /**
     * A function to handle closing the modal, allowing for a fade-out animation before unmounting.
     * @param {boolean} value - Indicates whether the modal should be closed.
     */
    handleCloseModal,
  };
};

export default useModal;
