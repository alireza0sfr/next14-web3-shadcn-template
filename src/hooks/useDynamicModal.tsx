import { useEffect, useState } from "react";

/**
 * A custom React hook to manage the state and lifecycle of a dynamic modal component, mostly used for having animations and dynamic imports at the same time.
 *
 * @function
 * @name useDynamicModal
 * @returns {Object} An object containing the state and functions to manage the modal.
 * @property {boolean} isModalOpen - Indicates whether the modal is currently open.
 * @property {function} setIsModalOpen - A function to set the state of the modal open or closed.
 * @property {boolean} shouldRenderModal - Indicates whether the modal should be rendered in the DOM.
 * @property {function} handleModalClose - A function to close the modal and trigger the unmounting after a delay.
 *
 * @example
 * const { isModalOpen, setIsModalOpen, shouldRenderModal, handleModalClose } = useDynamicModal();
 *
 * return (
 *   <>
 *     <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
 *     {shouldRenderModal ? (
 *       <ShareMarketModal
 *         isOpen={isModalOpen}
 *         onClose={handleModalClose}
 *         id={id}
 *         shortId={shortId}
 *       />
 *     ) : null}
 *   </>
 * );
 */
const useDynamicModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRenderModal, setShouldRenderModal] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setShouldRenderModal(true);
    }
  }, [isModalOpen]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Delay unmounting to allow close animation
    setTimeout(() => setShouldRenderModal(false), 400); // Adjust timeout to match your close animation duration
  };

  return {
    /**
     * Indicates whether the modal is currently open.
     */
    isModalOpen,
    /**
     * A function to set the state of the modal open or closed.
     */
    setIsModalOpen,
    /**
     * Indicates whether the modal should be rendered in the DOM.
     */
    shouldRenderModal,
    /**
     * A function to close the modal and trigger the unmounting after a delay.
     */
    handleModalClose,
  };
};

export default useDynamicModal;
